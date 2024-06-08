package system

import (
	"fmt"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
	"time"

	"github.com/camilojm27/trabajo-de-grado/service/pkg/util"
	"github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/shirou/gopsutil/v3/net"
)

func HostMetrics() {
	p, _ := net.ProtoCounters([]string{})
	fmt.Println(p[0].Stats)

	for {
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
			CPUUsage:     float64(int(percentages[0]*100)) / 100,
			MemUsage:     v.UsedPercent,
			MemTotal:     v.Total,
			MemAvailable: v.Available,
			SwapFree:     v.SwapFree,
			SwapTotal:    v.SwapTotal,
			NetIO: []net.IOCountersStat{
				net.IOCountersStat{
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
		sendMetrics(matrics)
	}
}

func sendMetrics(metrics types.HostMetrics) {
	//TODO: Send this using RabbitMQ
	//fmt.Println(metrics)
	err := util.SendData("http://localhost:8000/api/metrics", metrics)
	if err != nil {
		fmt.Printf("Error sending metrics: %v\n", err)
	}
}
