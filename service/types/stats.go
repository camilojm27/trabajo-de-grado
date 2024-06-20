package types

type Stats struct {
	NodeID      string  `json:"node_id"`
	ContainerID string  `json:"container_id"`
	CpuPercent  float64 `json:"cpu_percent"`
	MemPercent  float64 `json:"mem_percent"`
	MemFree     uint64  `json:"mem_free"`
	MemLimit    uint64  `json:"mem_limit"`
	BlockInput  uint64  `json:"block_input"`
	BlockOutput uint64  `json:"block_output"`
	NetInput    uint64  `json:"net_input"`
	NetOutput   uint64  `json:"net_output"`
	PIDs        uint64  `json:"pids"`
}
