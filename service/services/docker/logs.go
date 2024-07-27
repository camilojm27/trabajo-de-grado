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
	jobStatusMutex.Lock()
	defer jobStatusMutex.Unlock()

	if !runningLogs[containerID] {
		runningLogs[containerID] = true

		go func() {
			defer func() {
				jobStatusMutex.Lock()
				delete(runningLogs, containerID)
				jobStatusMutex.Unlock()
			}()
			// Create Docker client
			fmt.Println("LOGS STARTED")

			cli, err := client.NewClientWithOpts(client.FromEnv)
			if err != nil {
				log.Printf("failed to create docker client: %v", err)
				return
			}

			// Get container logs
			options := container.LogsOptions{ShowStdout: true, ShowStderr: true, Follow: true, Tail: "all"}
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
			// Read and send logs
			buffer := make([]byte, 4096)
			for {
				/*TODO: Works but there is a better way to do this
				- Some short logs are not being sent
				- If the logs are too long the pusher websocket will not be able to handle it
				- If it sent too much logs has to be handled on the frontend
				- Fix encoding, there are some weird characters
				*/

				n, err := logs.Read(buffer)
				if err != nil {
					if err == io.EOF {
						break
					}
					log.Printf("Error reading logs: %v", err)
					continue
				}

				fmt.Print(string(buffer[:n]))
				sendLogs.Logs = string(buffer[:n])
				jsonDataBytes, err := json.Marshal(sendLogs)

				if err != nil {
					fmt.Println(err)
				}

				sendLogsToRabbitMQ(ctx, rclient, jsonDataBytes)
			}
			ctx.Done() //If the context is done, the logs will be closed
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
