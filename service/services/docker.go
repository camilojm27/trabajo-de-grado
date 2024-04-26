package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/strslice"

	t "github.com/camilojm27/trabajo-de-grado/pgc/types"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

func Create(ctx context.Context, containerData t.ContainerRequest) (types.ContainerJSON, error) {
	imageName := containerData.Data.Image
	name := containerData.Data.Name

	envVariables := make([]string, len(containerData.Data.Attributes.Env))
	for i, env := range containerData.Data.Attributes.Env {
		if env.Name != "" || env.Value != "" {
			envVariables[i] = env.Name + "=" + env.Value
		}
	}

	if len(envVariables) == 1 && envVariables[0] == "" {
		envVariables = nil
	}
	// volumes := containerData.Data.Attributes.Volumes
	//// clearVolumens(&volumes)
	// ports := formatPorts(containerData.Data.Attributes.Ports)
	println(containerData.Data.Attributes.Volumes)

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	if _, _, err := cli.ImageInspectWithRaw(ctx, imageName); err != nil {
		fmt.Printf("Image %s not found locally. Pulling from Docker Hub...\n", imageName)
		out, err := cli.ImagePull(ctx, imageName, image.PullOptions{})
		if err != nil {
			return types.ContainerJSON{}, err
		}
		defer out.Close()
		// ioCopy(os.Stdout, out)
	}

	config := &container.Config{
		Image: imageName,
		Env:   envVariables,
		Cmd:   strslice.StrSlice{containerData.Data.Attributes.Cmd},
	}
	hostConfig := &container.HostConfig{
		// Binds:        volumes,
		// PortBindings: ports,
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

	inspect, errI := Inspect(ctx, resp.ID)

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

func Delete(ctx context.Context, containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	if err := cli.ContainerStop(ctx, containerID, container.StopOptions{}); err != nil {
		log.Println(err)
	}

	if err := cli.ContainerRemove(ctx, containerID, container.RemoveOptions{
		Force: true,
	}); err != nil {
		return types.ContainerJSON{}, err
	}

	return types.ContainerJSON{}, err

}

func Inspect(ctx context.Context, containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	info, err := cli.ContainerInspect(ctx, containerID)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	return info, nil

}

func Start(ctx context.Context, containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	if err := cli.ContainerStart(ctx, containerID, container.StartOptions{}); err != nil {
		return types.ContainerJSON{}, err
	}

	inspect, _ := Inspect(ctx, containerID)

	return inspect, err
}

func Stop(ctx context.Context, containerID string, timeout int) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	if err := cli.ContainerStop(ctx, containerID, container.StopOptions{}); err != nil {
		return types.ContainerJSON{}, err
	}

	inspect, _ := Inspect(ctx, containerID)

	return inspect, err
}

func Restart(ctx context.Context, containerID string, timeout int) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	if err := cli.ContainerRestart(ctx, containerID, container.StopOptions{}); err != nil {
		return types.ContainerJSON{}, err
	}

	inspect, _ := Inspect(ctx, containerID)

	return inspect, err
}

func Pause(ctx context.Context, containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err
	}

	defer cli.Close()

	if err := cli.ContainerPause(ctx, containerID); err != nil {
		return types.ContainerJSON{}, err

	}

	inspect, _ := Inspect(ctx, containerID)

	return inspect, err

}

func Kill(ctx context.Context, containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err

	}

	defer cli.Close()

	if err := cli.ContainerKill(ctx, containerID, "SIGKILL"); err != nil {
		return types.ContainerJSON{}, err

	}

	inspect, _ := Inspect(ctx, containerID)

	return inspect, err
}

func Unpause(ctx context.Context, containerID string) (types.ContainerJSON, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return types.ContainerJSON{}, err

	}

	defer cli.Close()

	if err := cli.ContainerUnpause(ctx, containerID); err != nil {
		return types.ContainerJSON{}, err

	}

	inspect, _ := Inspect(ctx, containerID)

	return inspect, err

}

func ListContainers(ctx context.Context) ([]types.Container, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatal(err)
	}

	defer cli.Close()

	list, err := cli.ContainerList(ctx, container.ListOptions{
		All: true,
	})

	return list, err

}

func SendContainersListBasedOnEventsAndTime(rmqClient *RabbitMQClient, ctx context.Context) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatal(err)
	}

	// Subscribe to Docker events (optional for sending based on events)
	eventChan, errChan := cli.Events(ctx, types.EventsOptions{
		Filters: filters.NewArgs(
			filters.KeyValuePair{
				Key:   "type",
				Value: "container",
			},
		),
	})

	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	fmt.Println("Listening to Docker events and sending container list every minute...")

	var lastEvent time.Time
	const shortPeriod = 10 * time.Second
	sendContainers(ctx, rmqClient)

	for {
		select {
		case <-ticker.C:
			sendContainers(ctx, rmqClient)

		case event := <-eventChan:
			if eventChan != nil {
				currentTimestamp := time.Now()
				if currentTimestamp.Sub(lastEvent) > shortPeriod {
					fmt.Printf("Received event: %v\n", event.Action)
					sendContainers(ctx, rmqClient)
					lastEvent = currentTimestamp
				}
			}
		case err := <-errChan:
			if errChan != nil {
				log.Printf("Error receiving event: %v\n", err)
			}
		}
	}
}

func sendContainers(ctx context.Context, rmqClient *RabbitMQClient) {
	list, err := ListContainers(ctx)
	if err != nil {
		log.Println("Error Getting ContainerList: ", err)
	}
	jsonData, err := json.Marshal(list)
	if err != nil {
		log.Println("Error marshalling ContainerList: ", err)
	}
	Response(ctx, rmqClient, string(jsonData), "LIST:CONTAINERS", 0, err)
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
