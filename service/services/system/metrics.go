package system

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/rabbitmq/amqp091-go"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
)

var (
	hostMetricsMutex   sync.Mutex
	runningHostMetrics bool
)

func HostMetrics(ctx context.Context, rclient *services.RabbitMQClient) error {
	nodeId := ctx.Value("nodeId").(string)

	fmt.Println("HOST METRICS CALLED")
	hostMetricsMutex.Lock()
	defer hostMetricsMutex.Unlock()

	if !runningHostMetrics {
		runningHostMetrics = true

		go func() {
			defer func() {
				hostMetricsMutex.Lock()
				runningHostMetrics = false
				hostMetricsMutex.Unlock()
			}()

			fmt.Println("HOST METRICS STARTED")
			ticker := time.NewTicker(time.Second) // Collect metrics every second
			defer ticker.Stop()

			for {
				select {
				case <-ticker.C:
					metrics, err := collectMetrics(nodeId)
					if err != nil {
						fmt.Printf("Error collecting metrics: %v\n", err)
						continue
					}

					jsonDataBytes, err := json.Marshal(metrics)
					if err != nil {
						fmt.Printf("Error marshaling metrics: %v\n", err)
						continue
					}

					err = sendMetricsToRabbitMQ(ctx, rclient, jsonDataBytes)
					if err != nil {
						fmt.Printf("Error sending metrics to RabbitMQ: %v\n", err)
					}

				case <-ctx.Done():
					fmt.Println("DONE HOST METRICS")
					return
				}
			}
		}()
	} else {
		fmt.Println("Host Metrics job is already running")
	}

	return nil
}

func collectMetrics(nodeId string) (types.HostMetrics, error) {
	v, err := mem.VirtualMemory()
	if err != nil {
		return types.HostMetrics{}, fmt.Errorf("error getting virtual memory: %v", err)
	}

	n, err := net.IOCounters(false)
	if err != nil {
		return types.HostMetrics{}, fmt.Errorf("error getting network IO counters: %v", err)
	}

	percentages, err := cpu.Percent(time.Second, false)
	if err != nil {
		return types.HostMetrics{}, fmt.Errorf("error getting CPU usage: %v", err)
	}

	nLater, err := net.IOCounters(false)
	if err != nil {
		return types.HostMetrics{}, fmt.Errorf("error getting later network IO counters: %v", err)
	}

	return types.HostMetrics{
		NodeId:       nodeId,
		CPUUsage:     float64(int(percentages[0]*100)) / 100,
		MemUsage:     v.UsedPercent,
		MemTotal:     v.Total,
		MemAvailable: v.Available,
		SwapFree:     v.SwapFree,
		SwapTotal:    v.SwapTotal,
		NetIO: []net.IOCountersStat{
			{
				BytesSent: nLater[0].BytesSent - n[0].BytesSent,
				BytesRecv: nLater[0].BytesRecv - n[0].BytesRecv,
			},
		},
	}, nil
}

func sendMetricsToRabbitMQ(ctx context.Context, client *services.RabbitMQClient, jsonDataBytes []byte) error {
	err := client.Publish(ctx, "", "host-metrics", false, false, amqp091.Publishing{
		ContentType: "application/json",
		Body:        jsonDataBytes,
	})

	if err != nil {
		return fmt.Errorf("error publishing to RabbitMQ: %v", err)
	}

	//fmt.Printf("Response sent for %v\n", string(jsonDataBytes))
	return nil
}
