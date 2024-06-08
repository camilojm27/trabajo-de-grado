package types

import "github.com/shirou/gopsutil/v3/net"

type SystemInfo struct {
	OS       OS       `json:"os"`
	Hardware Hardware `json:"hardware"`
	Software Software `json:"software"`
}

type OS struct {
	Hostname             string `json:"hostname"`
	HostId               string `json:"host_id"`
	System               string `json:"system"`
	Kernel               string `json:"kernel"`
	Name                 string `json:"name"`
	Version              string `json:"version"`
	BasedOn              string `json:"based_on"`
	Arch                 string `json:"arch"`
	Uptime               uint64 `json:"uptime"`
	BootTime             uint64 `json:"boot_time"`
	Procs                uint64 `json:"procs"`
	VirtualizationSystem string `json:"virtualization_system"`
	VirtualizationRole   string `json:"virtualization_role"`
}

type Hardware struct {
	CPU              string  `json:"cpu"`
	Cores            int     `json:"cores"`
	Threads          int     `json:"threads"`
	Ram              uint64  `json:"ram"`
	Swap             uint64  `json:"swap"`
	Disk             uint64  `json:"disk"`
	DiskAvail        uint64  `json:"disk_available"`
	DistkUsedPercent float64 `json:"disk_used_percent"`
	GPU              string  `json:"gpu"`
}

type Software struct {
	Python   string `json:"python"`
	Docker   string `json:"docker"`
	Php      string `json:"php"`
	Composer string `json:"composer"`
	Node     string `json:"node"`
	Npm      string `json:"npmjs"`
}

type HostMetrics struct {
	CPUUsage     float64 `json:"cpu_usage"`
	MemUsage     float64 `json:"mem_usage"`
	MemTotal     uint64  `json:"mem_total"`
	MemAvailable uint64  `json:"mem_available"`
	SwapFree     uint64  `json:"swap_free"`
	SwapTotal    uint64  `json:"swap_total"`
	NetIO        []net.IOCountersStat
}

type Network struct {
}
