package docker

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"sync"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	ty "github.com/camilojm27/trabajo-de-grado/service/types"

	"github.com/camilojm27/trabajo-de-grado/service/pkg/util"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/rabbitmq/amqp091-go"
)

var (
	logsMutex   sync.Mutex
	runningLogs = make(map[string]bool)
)

func Logs(ctx context.Context, rclient *services.RabbitMQClient, containerID string) error {
	nodeId := ctx.Value("nodeId").(string)

	fmt.Println("LOGS CALLED")
	logsMutex.Lock()
	defer logsMutex.Unlock()

	if !runningLogs[containerID] {
		runningLogs[containerID] = true

		go func() {
			defer func() {
				logsMutex.Lock()
				delete(runningLogs, containerID)
				logsMutex.Unlock()
			}()

			fmt.Println("LOGS STARTED")

			cli, err := client.NewClientWithOpts(client.FromEnv)
			if err != nil {
				log.Printf("failed to create docker client: %v", err)
				return
			}

			options := container.LogsOptions{ShowStdout: true, ShowStderr: true, Follow: true, Tail: "1000"}
			logs, err := cli.ContainerLogs(context.Background(), containerID, options)
			if err != nil {
				log.Printf("failed to get logs for container %s: %v", containerID, err)
				return
			}
			defer logs.Close()

			sendLogs := ty.Logs{
				NodeID:      nodeId,
				ContainerID: containerID,
			}

			// Create a larger buffer to handle varying log sizes
			buffer := make([]byte, 32*1024)
			headerSize := 8 // Docker log header size

			for {
				n, err := logs.Read(buffer)
				if err != nil {
					if err == io.EOF {
						break
					}
					log.Printf("Error reading logs: %v", err)
					continue
				}

				// Process the buffer in chunks, removing headers
				processed := make([]byte, 0, n)
				for i := 0; i < n; {
					// Ensure we have enough bytes for a header
					if i+headerSize > n {
						break
					}

					// Get the message length from the header (last 4 bytes)
					messageLength := int(buffer[i+4])<<24 | int(buffer[i+5])<<16 | int(buffer[i+6])<<8 | int(buffer[i+7])

					// Skip the header
					i += headerSize

					// Ensure we have enough bytes for the message
					if i+messageLength > n {
						break
					}

					// Append the message without the header
					processed = append(processed, buffer[i:i+messageLength]...)
					i += messageLength
				}

				if len(processed) > 0 {
					fmt.Print(string(processed))
					sendLogs.Logs = util.SafeString(processed)
					jsonDataBytes, err := json.Marshal(sendLogs)

					if err != nil {
						fmt.Println(err)
						continue
					}

					sendLogsToRabbitMQ(ctx, rclient, jsonDataBytes)
				}
			}

			select {
			default:
			case <-ctx.Done():
				logsMutex.Lock()
				delete(runningLogs, containerID)
				logsMutex.Unlock()
				logs.Close()
				fmt.Printf("DONE LOGS containerID: %s\n", containerID)
				return
			}
		}()
	} else {
		fmt.Printf("Job for containerID: %s is already running\n", containerID)
	}

	return nil
}

func sendLogsToRabbitMQ(ctx context.Context, client *services.RabbitMQClient, jsonDataBytes []byte) {
	err := client.Publish(ctx, "", "containers-logs", false, false, amqp091.Publishing{
		ContentType:  "application/json",
		Body:         jsonDataBytes,
		Expiration:   "10000",
		DeliveryMode: amqp091.Transient,
	})

	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("Response sent for %v\n", string(jsonDataBytes))
}
