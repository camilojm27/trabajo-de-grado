package system

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/rabbitmq/amqp091-go"
)

func SendNodeInfoPeriodically(ctx context.Context, rclient *services.RabbitMQClient) {
	ticker := time.NewTicker(2 * time.Minute)
	defer ticker.Stop()

	nodeId := ctx.Value("nodeId").(string)

	for {
		select {
		case <-ticker.C:
			// Obtener información actualizada del sistema
			currentInfo := GetCurrentNodeInfo()

			// Preparar datos para enviar
			updateData := map[string]interface{}{
				"node_id":    nodeId,
				"attributes": currentInfo,
			}

			jsonData, err := json.Marshal(updateData)
			if err != nil {
				log.Printf("Error marshalling node info: %v", err)
				continue
			}

			// Enviar la actualización usando amqp091.Publishing
			err = rclient.Publish(ctx, "", "node-updates", false, false, amqp091.Publishing{
				ContentType: "application/json",
				Body:        jsonData,
			})

			if err != nil {
				log.Printf("Error sending node update: %v", err)
			} else {
				fmt.Printf("Node info update sent for node %s\n", nodeId)
			}

		case <-ctx.Done():
			log.Println("Stopping node info updates")
			return
		}
	}
}
