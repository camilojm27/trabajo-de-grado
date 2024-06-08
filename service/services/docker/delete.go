package docker

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"log"
)

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
