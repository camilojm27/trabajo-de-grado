package start

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/camilojm27/trabajo-de-grado/pgc/services"
	"github.com/camilojm27/trabajo-de-grado/pgc/types"
	"github.com/rabbitmq/amqp091-go"
	"log"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func RunStartCommand(cmd *cobra.Command, args []string) {
	fmt.Println("start called")
	NodeId := viper.GetString("NODE_ID")

	client, err := services.NewRabbitMQClient()
	if err != nil {
		log.Fatal(err)
	}

	defer client.Close()

	ctx := context.Background()

	handler := func(d amqp091.Delivery) {
		var message types.ContainerRequest

		err := json.Unmarshal(d.Body, &message)
		if err != nil {
			fmt.Println("Error parsing JSON:", err)
			panic(err)
		}

		fmt.Printf("Action: %s\n", message.Action)
		fmt.Printf("Received message: %v\n", message.Data)

		switch message.Action {
		case "CREATE:CONTAINER":
			container, err := services.Create(ctx, message)
			services.Response(ctx, client, container, message.Action, message.PID, err)
		case "START:CONTAINER":
			started, err := services.Start(message.Data.ContainerID)
			services.Response(ctx, client, started, message.Action, message.PID, err)
		case "DELETE:CONTAINER":
			deleted, err := services.Delete(message.Data.ContainerID)
			services.Response(ctx, client, deleted, message.Action, message.PID, err)
		}
	}

	if err := client.Consume(ctx, NodeId, handler); err != nil {
		log.Fatal(err)
	}

}
