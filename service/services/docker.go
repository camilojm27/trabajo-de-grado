package services

// func clearVolumens(volumens *[]string) {
// 	for i, v := range *volumens {
// 		if v == "" {
// 			*volumens = append((*volumens)[:i], (*volumens)[i+1:]...)
// 		}
// 	}

// }

// func parseStats(stats types.ContainerStats) {

// 	var cpuPerc float64
// 	var memUsage bytes.Buffer
// 	defer stats.Body.Close()
// 	decoder := json.NewDecoder(stats.Body)
// 	for {
// 		var stat map[string]interface{}
// 		if err := decoder.Decode(&stat); err != nil {
// 			if err == io.EOF {
// 				break
// 			}
// 			fmt.Printf("Error decoding stats for container %s: %v\n", container.ID, err)
// 			continue
// 		}

// 		// Extract CPU percentage (adjust based on actual stat names)
// 		if cpu, ok := stat["cpu_stats"]; ok {
// 			cpuStats := cpu.(map[string]interface{})
// 			cpuPerc = cpuStats["cpu_usage"].(float64) / cpuStats["system_cpu_usage"].(float64) * 100
// 		}

// 		// Extract memory usage (adjust based on actual stat names)
// 		if memory, ok := stat["memory_stats"]; ok {
// 			memStats := memory.(map[string]interface{})
// 			memUsage.WriteString(fmt.Sprintf("RSS: %d bytes\n", int64(memStats["rss"])))
// 		}
// 	}

// }
