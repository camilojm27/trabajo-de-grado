package docker

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

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
