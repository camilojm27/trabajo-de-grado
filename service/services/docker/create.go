package docker

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/camilojm27/trabajo-de-grado/service/types"
	types2 "github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/api/types/strslice"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

func Create(ctx context.Context, containerData types.ContainerRequest) (types2.ContainerJSON, error) {
	imageName := containerData.Data.Image
	name := containerData.Data.Name
	networkName := containerData.Data.Attributes.NetworkName // This can be empty

	envVariables := make([]string, len(containerData.Data.Attributes.Env))
	for i, env := range containerData.Data.Attributes.Env {
		if env.Name != "" || env.Value != "" {
			envVariables[i] = env.Name + "=" + env.Value
		}
	}
	if len(envVariables) == 1 && envVariables[0] == "" {
		envVariables = nil
	}

	volumes := containerData.Data.Attributes.Volumes
	ports := formatPorts(containerData.Data.Attributes.Ports)

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types2.ContainerJSON{}, err
	}
	defer cli.Close()

	if _, _, err := cli.ImageInspectWithRaw(ctx, imageName); err != nil {
		reader, err := cli.ImagePull(ctx, imageName, image.PullOptions{})
		if err != nil {
			fmt.Printf("Error pulling image: %v\n", err)
			return types2.ContainerJSON{}, err
		}
		defer reader.Close()
		_, err = io.Copy(os.Stdout, reader)
		if err != nil {
			fmt.Printf("Error copying output: %v\n", err)
			return types2.ContainerJSON{}, err
		}
		fmt.Printf("Successfully pulled image: %s\n", imageName)
	}

	var networkingConfig *network.NetworkingConfig
	if networkName != "" {
		// Check if the network exists, create it if it doesn't
		_, err = cli.NetworkInspect(ctx, networkName, types2.NetworkInspectOptions{})
		if client.IsErrNotFound(err) {
			_, err := cli.NetworkCreate(ctx, networkName, types2.NetworkCreate{
				Driver: "bridge",
			})
			if err != nil {
				fmt.Printf("Error creating network: %v\n", err)
				return types2.ContainerJSON{}, err
			}
			fmt.Printf("Created network: %s\n", networkName)
		} else if err != nil {
			fmt.Printf("Error inspecting network: %v\n", err)
			return types2.ContainerJSON{}, err
		}

		networkingConfig = &network.NetworkingConfig{
			EndpointsConfig: map[string]*network.EndpointSettings{
				networkName: {},
			},
		}
	}

	config := &container.Config{
		Image: imageName,
		Env:   envVariables,
	}
	if containerData.Data.Attributes.Cmd != "" {
		config.Cmd = strslice.StrSlice{containerData.Data.Attributes.Cmd}
	}

	hostConfig := &container.HostConfig{}
	if len(volumes) <= 1 {
		hostConfig = &container.HostConfig{
			PortBindings: ports,
		}
	} else {
		hostConfig = &container.HostConfig{
			Binds:        volumes,
			PortBindings: ports,
		}
	}

	resp, err := cli.ContainerCreate(
		ctx,
		config,
		hostConfig,
		networkingConfig,
		nil,
		name,
	)
	if err != nil {
		return types2.ContainerJSON{}, err
	}

	inspect, errI := Inspect(ctx, resp.ID)
	if err := cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		if errI != nil {
			return types2.ContainerJSON{
				ContainerJSONBase: &types2.ContainerJSONBase{
					ID: resp.ID,
				},
			}, err
		}
	}

	if networkName != "" {
		fmt.Printf("Container %s created successfully and joined network %s\n", resp.ID, networkName)
	} else {
		fmt.Printf("Container %s created successfully with default network settings\n", resp.ID)
	}
	return inspect, nil
}

func formatPorts(ports []types.PortBinding) nat.PortMap {
	portMap := nat.PortMap{}
	for _, p := range ports {
		containerPort, err := nat.NewPort(p.Protocol, p.ContainerPort)
		if err != nil {
			// Handle error
			continue
		}
		portMap[containerPort] = []nat.PortBinding{
			{
				HostIP:   p.HostIP,
				HostPort: p.HostPort,
			},
		}
	}
	return portMap
}
