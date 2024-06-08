package docker

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"log"
	"time"
)

func SendContainersListBasedOnEventsAndTime(rmqClient *services.RabbitMQClient, ctx context.Context) {
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

func sendContainers(ctx context.Context, rmqClient *services.RabbitMQClient) {
	list, err := ListContainers(ctx)
	if err != nil {
		log.Println("Error Getting ContainerList: ", err)
	}
	jsonData, err := json.Marshal(list)
	if err != nil {
		log.Println("Error marshalling ContainerList: ", err)
	}
	services.Response(ctx, rmqClient, string(jsonData), "LIST:CONTAINERS", 0, err)
}
