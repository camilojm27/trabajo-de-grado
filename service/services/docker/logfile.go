package docker

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"sync"

	ty "github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

var (
	logMutex   sync.Mutex
	runningLog = make(map[string]bool)
)

func LogFile(ctx context.Context, containerData ty.ContainerRequestData, apiEndpoint string) error {
	containerID := containerData.ContainerID
	fmt.Println(containerID)
	const maxLogSize = 100 * 1024 * 1024 // 100MB
	// nodeId := ctx.Value("nodeId").(string)

	fmt.Println("LOGS CALLED")
	fmt.Println(containerData.ContainerID)
	jobStatusMutex.Lock()
	defer jobStatusMutex.Unlock()

	if !runningLog[containerID] {
		runningLog[containerID] = true

		go func() {
			defer func() {
				jobStatusMutex.Lock()
				delete(runningLog, containerID)
				jobStatusMutex.Unlock()
			}()
			// Create Docker client
			fmt.Println("LOG FILE STARTED")
			apiEndpoint = apiEndpoint + "/api/logs/upload/" + containerData.Hash

			cli, err := client.NewClientWithOpts(client.FromEnv)
			if err != nil {
				log.Printf("failed to create docker client: %v", err)
				return
			}

			options := container.LogsOptions{
				ShowStdout: true,
				ShowStderr: true,
				Follow:     false,
				Tail:       "all",
			}

			// Get logs from the container
			logs, err := cli.ContainerLogs(context.Background(), containerID, options)
			if err != nil {
				log.Printf("failed to get logs for container %s: %v", containerID, err)
				return

			}
			defer logs.Close()

			// Read logs into a buffer and enforce a 100MB limit
			var buf bytes.Buffer
			written, err := io.CopyN(&buf, logs, maxLogSize)
			if err != nil && err != io.EOF {
				log.Printf("failed to read logs for container %s: %v", containerID, err)
				return
			}

			// If the log size exceeds the limit, log a message
			if written == maxLogSize {
				log.Println("log size exceeded 100MB and was truncated")
			}
			fmt.Println("---------------------------------------------")
			err = sendLogsToAPI(apiEndpoint, &buf)
			if err != nil {
				log.Fatalf("failed to send logs to API: %v", err)
			}

			ctx.Done() //If the context is done, the logs will be closed
			select {
			default:

			case <-ctx.Done():
				logMutex.Lock()
				delete(runningLog, containerID)
				logMutex.Unlock()
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
func sendLogsToAPI(apiURL string, logBuffer *bytes.Buffer) error {

	// Prepare a multipart form to send the log file
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// Create a form file field for the logs
	part, err := writer.CreateFormFile("log_file", "container_logs.txt")
	if err != nil {
		return err
	}

	// Copy the log buffer into the form file field
	_, err = io.Copy(part, logBuffer)
	if err != nil {
		return err
	}

	// Close the writer to finalize the form
	err = writer.Close()
	if err != nil {
		return err
	}

	// Send the POST request with the multipart form
	req, err := http.NewRequest("POST", apiURL, &requestBody)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Handle API response
	if resp.StatusCode != http.StatusOK {
		// print the body of the response
		bd, _ := io.ReadAll(resp.Body)
		fmt.Println(string(bd))

		return fmt.Errorf("API returned status code %d", resp.StatusCode)
	}

	log.Println("Logs successfully posted to API")
	return nil
}
