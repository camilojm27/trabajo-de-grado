package docker

import (
	"bufio"
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

			options := container.LogsOptions{
				ShowStdout: true,
				ShowStderr: true,
				Follow:     true,
				Tail:       "1000",
			}

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

			reader := bufio.NewReader(logs)
			for {
				// Read the first byte to determine the stream type
				streamType, err := reader.ReadByte()
				if err != nil {
					if err == io.EOF {
						break
					}
					log.Printf("failed to read log header: %v", err)
					continue
				}

				// Skip the next 7 bytes (rest of the header)
				_, err = reader.Discard(7)
				if err != nil {
					log.Printf("failed to discard header bytes: %v", err)
					continue
				}

				// Read the actual log line
				line, err := reader.ReadString('\n')
				if err != nil && err != io.EOF {
					log.Printf("failed to read log line: %v", err)
					continue
				}

				// Determine the stream prefix
				var prefix string
				if streamType == 1 {
					prefix = "[stdout] "
				} else if streamType == 2 {
					prefix = "[stderr] "
				}

				// Combine prefix and line
				logLine := prefix + line

				fmt.Print(logLine)
				jsonDataBytes, err := json.Marshal(sendLogs)
				if err != nil {
					fmt.Println(err)
					continue
				}

				sendLogsToRabbitMQ(ctx, rclient, jsonDataBytes)

				if err == io.EOF {
					break
				}
			}
			ctx.Done()
			select {
			case <-ctx.Done():
				logsMutex.Lock()
				delete(runningLogs, containerID)
				logsMutex.Unlock()
				logs.Close()
				fmt.Printf("DONE LOGS containerID: %s\n", containerID)
			default:
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
