package docker

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"log"
)

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
