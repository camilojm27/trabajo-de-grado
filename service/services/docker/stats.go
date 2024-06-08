package docker

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"

	"github.com/camilojm27/trabajo-de-grado/service/pkg/util"
	ty "github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

func calculateCPUPercent(stats types.StatsJSON) float64 {
	cpuDelta := float64(stats.CPUStats.CPUUsage.TotalUsage) - float64(stats.PreCPUStats.CPUUsage.TotalUsage)
	systemDelta := float64(stats.CPUStats.SystemUsage) - float64(stats.PreCPUStats.SystemUsage)
	cpuPercent := (cpuDelta / systemDelta) * float64(len(stats.CPUStats.CPUUsage.PercpuUsage)) * 100.0
	return cpuPercent
}

func calculateMemoryPercent(stats types.StatsJSON) float64 {
	return float64(stats.MemoryStats.Usage) / float64(stats.MemoryStats.Limit) * 100.0
}

func Stats(ctx context.Context, containerID string) {
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

		// Print the stats (you can customize this output as needed)
		fmt.Printf("Container ID: %s\n", containerID)
		fmt.Printf("CPU Usage: %v\n", statsJSON.CPUStats.CPUUsage)
		fmt.Printf("Memory Usage: %v / %v\n", statsJSON.MemoryStats.Usage, statsJSON.MemoryStats.Limit)
		fmt.Printf("Network IO: %v / %v\n", statsJSON.Networks["eth0"].RxBytes, statsJSON.Networks["eth0"].TxBytes)
		fmt.Printf("Block I/O: %s / %s\n", fmt.Sprintf("%d", statsJSON.BlkioStats.IoServiceBytesRecursive[0].Value), fmt.Sprintf("%d", statsJSON.BlkioStats.IoServiceBytesRecursive[1].Value))
		fmt.Printf("PIDs: %d\n", statsJSON.PidsStats.Current)
		fmt.Println()

		sendstats := ty.Stats{
			ContainerID: "1",
			CpuPercent:  cpuPercent,
			MemPercent:  memoryPercent,
			MemFree:     statsJSON.MemoryStats.Usage,
			MemLimit:    statsJSON.MemoryStats.Limit,
			NetInput:    statsJSON.Networks["eth0"].RxBytes,
			NetOutput:   statsJSON.Networks["eth0"].TxBytes,
			BlockInput:  statsJSON.BlkioStats.IoServiceBytesRecursive[0].Value,
			BlockOutput: statsJSON.BlkioStats.IoServiceBytesRecursive[1].Value,
			PIDs:        statsJSON.PidsStats.Current,
		}

		sendStats(sendstats, containerID)
	}

}

func sendStats(stats ty.Stats, containerID string) {
	url := "http://localhost:8000/api/metrics"
	util.SendData(url, stats)

}
