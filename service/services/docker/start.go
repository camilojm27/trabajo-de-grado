package docker

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

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
