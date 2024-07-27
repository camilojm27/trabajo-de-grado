package docker

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"sync"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/docker/docker/client"
	"github.com/rabbitmq/amqp091-go"

	ty "github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/docker/docker/api/types"
)

var (
	jobStatusMutex sync.Mutex
	activeStats    = make(map[string]bool)
	// Variables to store previous network stats
	prevNetworkInput  uint64
	prevNetworkOutput uint64
)

func calculateCPUPercent(stats types.StatsJSON) float64 {
	cpuDelta := float64(stats.CPUStats.CPUUsage.TotalUsage) - float64(stats.PreCPUStats.CPUUsage.TotalUsage)
	systemDelta := float64(stats.CPUStats.SystemUsage) - float64(stats.PreCPUStats.SystemUsage)
	cpuPercent := (cpuDelta / systemDelta) * float64(stats.CPUStats.OnlineCPUs) * 100.0
	return cpuPercent
}

func calculateMemoryPercent(stats types.StatsJSON) float64 {
	return float64(stats.MemoryStats.Usage) / float64(stats.MemoryStats.Limit) * 100.0
}

// TODO: fix this 2 function to send right values
func calculateNetInput(stats types.StatsJSON) uint64 {
	var networkInput uint64
	for _, v := range stats.Networks {
		networkInput += v.RxBytes
	}
	networkInputDelta := networkInput - prevNetworkInput
	prevNetworkInput = networkInput
	return networkInputDelta // Convert to megabytes
}

func calculateNetOutput(stats types.StatsJSON) uint64 {
	var networkOutput uint64
	for _, v := range stats.Networks {
		networkOutput += v.TxBytes
	}
	networkOutputDelta := networkOutput - prevNetworkOutput
	prevNetworkOutput = networkOutput
	return networkOutputDelta // Convert to megabytes
}

func Stats(ctx context.Context, rclient *services.RabbitMQClient, containerID string) {
	nodeId := ctx.Value("nodeId").(string)

	fmt.Println("Host Metrics called")
	jobStatusMutex.Lock()
	defer jobStatusMutex.Unlock()

	if !activeStats[containerID] {
		activeStats[containerID] = true

		go func() {
			defer func() {
				jobStatusMutex.Lock()
				delete(activeStats, containerID)
				jobStatusMutex.Unlock()
			}()

			fmt.Println("----------------- Container Metrics -----------------")

			// Create a new Docker client
			cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
			if err != nil {
				log.Fatalf("Error creating Docker client: %v", err)
			}

			// Create a context with a timeout for the stats request
			// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			// defer cancel()

			// Get stats for each container
			stats, err := cli.ContainerStats(ctx, containerID, true)
			if err != nil {
				log.Printf("Error getting stats for container %s: %v", containerID, err)
				return
			}
			defer stats.Body.Close()

			// Read and decode the stats JSON stream
			decoder := json.NewDecoder(stats.Body)
			for {
				var statsJSON types.StatsJSON
				if err := decoder.Decode(&statsJSON); err == io.EOF {
					break
				} else if err != nil {
					log.Printf("Error decoding stats for container %s: %v", containerID, err)
					break
				}
				// Calculate CPU and Memory usage percentages
				cpuPercent := calculateCPUPercent(statsJSON)
				memoryPercent := calculateMemoryPercent(statsJSON)
				fmt.Printf("CPU Usage: %.2f%%\n", cpuPercent)
				fmt.Printf("Memory Usage: %.2f%%\n", memoryPercent)

				// Calculate network input and output in megabytes
				netInputMB := calculateNetInput(statsJSON)
				netOutputMB := calculateNetOutput(statsJSON)
				fmt.Printf("Network Input: %.2f MB, Network Output: %.2f MB\n", float64(netInputMB), float64(netOutputMB))

				// Print the stats (you can customize this output as needed)
				fmt.Printf("Container ID: %s\n", containerID)
				fmt.Printf("CPU Usage: %v\n", statsJSON.CPUStats.CPUUsage)
				fmt.Printf("Memory Usage: %v / %v\n", statsJSON.MemoryStats.Usage, statsJSON.MemoryStats.Limit)
				fmt.Printf("Network IO: %v / %v\n", statsJSON.Networks["eth0"].RxBytes, statsJSON.Networks["eth0"].TxBytes)
				fmt.Printf("PIDs: %d\n", statsJSON.PidsStats.Current)
				fmt.Println()

				sendstats := ty.Stats{
					NodeID:      nodeId,
					ContainerID: containerID,
					CpuPercent:  cpuPercent,
					MemPercent:  memoryPercent,
					MemFree:     statsJSON.MemoryStats.Usage,
					MemLimit:    statsJSON.MemoryStats.Limit,
					NetInput:    netInputMB,
					NetOutput:   netOutputMB,
					BlockInput:  0,
					BlockOutput: 0,
					PIDs:        statsJSON.PidsStats.Current,
				}

				jsonDataBytes, err := json.Marshal(sendstats)
				if err != nil {
					log.Printf("Error marshalling stats for container %s: %v", containerID, err)
					jobStatusMutex.Lock()
					delete(activeStats, containerID)
					jobStatusMutex.Unlock()
					stats.Body.Close()
					return
				}

				sendMetrics(ctx, rclient, jsonDataBytes)
			}
			ctx.Done() // If the context is done, the stats will be closed

			select {
			default:

			case <-ctx.Done():
				jobStatusMutex.Lock()
				delete(activeStats, containerID)
				jobStatusMutex.Unlock()
				stats.Body.Close()
				return
			}

			fmt.Printf("Running job for containerID: %s\n", containerID)
		}()
	} else {
		fmt.Printf("Job for containerID: %s is already running\n", containerID)
	}
}

func sendMetrics(ctx context.Context, client *services.RabbitMQClient, jsonDataBytes []byte) {

	err := client.Publish(ctx, "", "containers-metrics", false, false, amqp091.Publishing{
		ContentType:  "application/json", // Adjust content type based on your message
		Body:         jsonDataBytes,
		Expiration:   "10000",
		DeliveryMode: amqp091.Transient,
	})

	if err != nil {
		fmt.Println(err)
	}
	//fmt.Printf("Response sent for %v\n", string(jsonDataBytes))
}
