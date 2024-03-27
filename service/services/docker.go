package services

import (
	"context"
	"fmt"
	t "github.com/camilojm27/trabajo-de-grado/pgc/types"
	"log"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

func Create(ctx context.Context, containerData t.ContainerRequest) (types.ContainerJSON, error) {
	imageName := containerData.Data.Image
	name := containerData.Data.Name

	envVariables := make([]string, len(containerData.Data.Attributes.Env))
	for i, env := range containerData.Data.Attributes.Env {
		envVariables[i] = env.Name + "=" + env.Value
	}
	// volumes := containerData.Data.Attributes.Volumes
	// clearVolumens(&volumes)
	ports := formatPorts(containerData.Data.Attributes.Ports)
	println(containerData.Data.Attributes.Volumes)

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	if _, _, err := cli.ImageInspectWithRaw(ctx, imageName); err != nil {
		fmt.Printf("Image %s not found locally. Pulling from Docker Hub...\n", imageName)
		out, err := cli.ImagePull(ctx, imageName, types.ImagePullOptions{})
		if err != nil {
			return types.ContainerJSON{}, err
		}
		defer out.Close()
		// ioCopy(os.Stdout, out)
	}

	config := &container.Config{
		Image: imageName,
		Env:   envVariables,
	}
	hostConfig := &container.HostConfig{
		// Binds:        volumes,
		PortBindings: ports,
	}

	resp, err := cli.ContainerCreate(
		ctx,
		config,
		hostConfig,
		nil,
		nil,
		name,
	)

	if err != nil {
		return types.ContainerJSON{}, err
	}

	inspect, errI := Inspect(resp.ID)

	//TODO: Cuando se envie este error, se debe validad en la plataforma de que el contenedor fue creado
	// pero no se pudo iniciar

	if err := cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		if errI != nil {
			return types.ContainerJSON{
				ContainerJSONBase: &types.ContainerJSONBase{
					ID: resp.ID,
				},
			}, err
		}

	}
	fmt.Printf("Container %s created successfully\n", resp.ID)

	defer cli.Close()
	return inspect, nil
}

// func clearVolumens(volumens *[]string) {
// 	for i, v := range *volumens {
// 		if v == "" {
// 			*volumens = append((*volumens)[:i], (*volumens)[i+1:]...)
// 		}
// 	}

// }

func Delete(containerID string) (bool, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return false, err
	}

	defer cli.Close()

	if err := cli.ContainerStop(context.Background(), containerID, container.StopOptions{}); err != nil {
		log.Println(err)
	}

	if err := cli.ContainerRemove(context.Background(), containerID, container.RemoveOptions{
		Force: true,
	}); err != nil {
		return false, err
	}

	return true, err

}

func Inspect(containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	info, err := cli.ContainerInspect(context.Background(), containerID)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	return info, nil

}

func Start(containerID string) (bool, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return false, err
	}

	defer cli.Close()

	if err := cli.ContainerStart(context.Background(), containerID, container.StartOptions{}); err != nil {
		return false, err
	}

	return true, nil

}

func Stop(containerID string, timeout int) (bool, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return false, err
	}

	defer cli.Close()

	if err := cli.ContainerStop(context.Background(), containerID, container.StopOptions{}); err != nil {
		return false, err
	}

	return true, nil
}

func formatPorts(ports []string) map[nat.Port][]nat.PortBinding {
	portBindings := make(map[nat.Port][]nat.PortBinding)

	for _, mapping := range ports {
		parts := strings.Split(mapping, ":")

		// Check the length of the parts to determine the type of mapping
		switch len(parts) {
		case 2:
			// Format: "HostPort:ContainerPort"
			hostPort := nat.Port(parts[0])
			containerPort := nat.Port(parts[1])
			portBindings[containerPort] = []nat.PortBinding{{HostIP: "0.0.0.0", HostPort: string(hostPort)}}
		case 3:
			// Format: "HostIP:HostPort:ContainerPort"
			hostIP := parts[0]
			hostPort := nat.Port(parts[1])
			containerPort := nat.Port(parts[2])
			portBindings[containerPort] = []nat.PortBinding{{HostIP: hostIP, HostPort: string(hostPort)}}

		//case 4:
		//	// Format: "HostPort:ContainerPort/Protocol"
		//	hostPort := nat.Port(parts[0])
		//	containerPort, protocol := nat.ParsePortSpec(parts[1] + "/" + parts[2])
		//	portBindings[containerPort] = []nat.PortBinding{{HostIP: "0.0.0.0", HostPort: string(hostPort), HostPortType: protocol}}
		default:
			log.Printf("Invalid port mapping format: %s\n", mapping)
		}
	}

	fmt.Printf("PortBindings: %+v\n", portBindings)
	return portBindings
}

// func ioCopy(w io.Writer, resp io.ReadCloser) {
// 	defer resp.Close()
// 	io.Copy(w, resp)
// }
