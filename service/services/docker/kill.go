package docker

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

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
