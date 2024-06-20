package start

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/camilojm27/trabajo-de-grado/service/services/docker"
	"github.com/camilojm27/trabajo-de-grado/service/services/system"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/rabbitmq/amqp091-go"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func RunStartCommand(cmd *cobra.Command, args []string) {
	fmt.Println("start called")
	nodeId := viper.GetString("NODE_ID")

	client, err := services.NewRabbitMQClient()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	type contextKey string
	ctx := context.WithValue(context.Background(), "nodeId", nodeId)
	ctxTime := context.Background()

	go docker.SendContainersListBasedOnEventsAndTime(client, ctxTime)

	handler := func(d amqp091.Delivery) {
		var message types.ContainerRequest
		err := json.Unmarshal(d.Body, &message)
		if err != nil {
			fmt.Println("Error parsing JSON:", err)
			if err != nil {
				log.Panic(err.Error())
			}
			err := d.Nack(false, true) // Nack the message with requeue
			if err != nil {
				log.Panic(err.Error())
			}
			return
		}

		fmt.Printf("Action: %s\n", message.Action)
		fmt.Printf("Received message: %v\n", message.Data)

		switch message.Action {
		// ----------------- Container Actions -----------------
		case "CREATE:CONTAINER":
			container, err := docker.Create(ctx, message)
			services.Response(ctx, client, container, message.Action, message.PID, err)
		case "START:CONTAINER":
			started, err := docker.Start(ctx, message.Data.ContainerID)
			services.Response(ctx, client, started, message.Action, message.PID, err)
		case "DELETE:CONTAINER":
			deleted, err := docker.Delete(ctx, message.Data.ContainerID)
			services.Response(ctx, client, deleted, message.Action, message.PID, err)
		case "STOP:CONTAINER":
			stoped, err := docker.Stop(ctx, message.Data.ContainerID, 10)
			services.Response(ctx, client, stoped, message.Action, message.PID, err)
		case "RESTART:CONTAINER":
			restarted, err := docker.Restart(ctx, message.Data.ContainerID, 10)
			services.Response(ctx, client, restarted, message.Action, message.PID, err)
		case "PAUSE:CONTAINER":
			paused, err := docker.Pause(ctx, message.Data.ContainerID)
			services.Response(ctx, client, paused, message.Action, message.PID, err)
		case "UNPAUSE:CONTAINER":
			unpaused, err := docker.Unpause(ctx, message.Data.ContainerID)
			services.Response(ctx, client, unpaused, message.Action, message.PID, err)
		case "KILL:CONTAINER":
			killed, err := docker.Kill(ctx, message.Data.ContainerID)
			services.Response(ctx, client, killed, message.Action, message.PID, err)
		case "METRICS:CONTAINER":
			ctxMetrics, _ := context.WithTimeout(ctx, time.Second*30000)
			docker.Stats(ctxMetrics, client, message.Data.ContainerID)

		// ----------------- Host Actions -----------------
		case "METRICS:HOST":
			ctxMetrics, _ := context.WithTimeout(ctx, time.Second*30)
			//defer cancel()

			system.HostMetrics(ctxMetrics, client)
		}

		d.Ack(true) // Acknowledge the message after successful processing
	}

	if err := client.Consume(ctx, nodeId, handler); err != nil {
		log.Fatal(err)
	}
}
