package system

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/rabbitmq/amqp091-go"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	"github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/shirou/gopsutil/v3/net"
)

var (
	jobIsRunning   bool
	jobIsRunningMu sync.Mutex
)

func HostMetrics(ctx context.Context, client *services.RabbitMQClient) {
	nodeId := ctx.Value("nodeId").(string)

	fmt.Println("Host Metrics called")
	jobIsRunningMu.Lock()
	fmt.Println(jobIsRunning)
	if !jobIsRunning {
		jobIsRunning = true
		jobIsRunningMu.Unlock()

		go func() {
			fmt.Println("----------------- Host Metrics -----------------")
			p, _ := net.ProtoCounters([]string{})
			fmt.Println(p[0].Stats)
			for {
				select {
				case <-ctx.Done():
					jobIsRunningMu.Lock()
					jobIsRunning = false
					jobIsRunningMu.Unlock()
					fmt.Println("----------------- Host Metrics DONE -----------------")

					return

				default:
					jobIsRunningMu.Lock()
					jobIsRunning = true

					// Get CPU usage percentage
					v, _ := mem.VirtualMemory()
					n, _ := net.IOCounters(false)
					percentages, err := cpu.Percent(time.Second, false)
					if err != nil {
						fmt.Printf("Error: %v\n", err)
						return
					}
					nLater, _ := net.IOCounters(false)
					matrics := types.HostMetrics{
						NodeId:       nodeId,
						CPUUsage:     float64(int(percentages[0]*100)) / 100,
						MemUsage:     v.UsedPercent,
						MemTotal:     v.Total,
						MemAvailable: v.Available,
						SwapFree:     v.SwapFree,
						SwapTotal:    v.SwapTotal,
						NetIO: []net.IOCountersStat{
							{
								//Name:        "",
								BytesSent:   nLater[0].BytesSent - n[0].BytesSent,
								BytesRecv:   nLater[0].BytesRecv - n[0].BytesRecv,
								PacketsSent: 0,
								PacketsRecv: 0,
								Errin:       0,
								Errout:      0,
								Dropin:      0,
								Dropout:     0,
								Fifoin:      0,
								Fifoout:     0,
							},
						},
						//TODO: Add total bytesSent, BytesRecv to have some pills with this information
					}
					sendMetrics(ctx, matrics, client)
					jobIsRunningMu.Unlock()
				}
			}

		}()
	} else {
		jobIsRunningMu.Unlock()
	}

}

func sendMetrics(ctx context.Context, response types.HostMetrics, client *services.RabbitMQClient) {

	jsonDataBytes, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	err = client.Publish(ctx, "", "metrics", false, false, amqp091.Publishing{
		ContentType:  "application/json", // Adjust content type based on your message
		Body:         jsonDataBytes,
		Expiration:   "10000",
		DeliveryMode: amqp091.Transient,
	})

	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("Response sent for %v\n", response)
}
