package docker

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

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
