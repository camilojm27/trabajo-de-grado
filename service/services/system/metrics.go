package system

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/rabbitmq/amqp091-go"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
)

func HostMetrics(ctx context.Context, rclient *services.RabbitMQClient) {
	nodeId := ctx.Value("nodeId").(string)

	fmt.Println("----------------- Host Metrics -----------------")
	ticker := time.NewTicker(time.Second) // Collect metrics every second
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			v, _ := mem.VirtualMemory()
			n, _ := net.IOCounters(false)
			percentages, err := cpu.Percent(time.Second, false)
			if err != nil {
				fmt.Printf("Error: %v\n", err)
				continue
			}
			nLater, _ := net.IOCounters(false)
			metrics := types.HostMetrics{
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
			}
			jsonDataBytes, err := json.Marshal(metrics)

			err = rclient.Publish(ctx, "", "host-metrics", false, true, amqp091.Publishing{
				ContentType: "application/json",
				Body:        jsonDataBytes,
			})

			if err != nil {
				fmt.Println(err)
			}
			//fmt.Printf("Response sent for %v\n", string(jsonDataBytes))

		case <-ctx.Done():
			return
		}
	}
}
