package types

type SystemInfo struct {
	OS       OS       `json:"os"`
	Hardware Hardware `json:"hardware"`
	Software Software `json:"software"`
}

type OS struct {
	System   string   `json:"system"`
	Kernel   string   `json:"kernel"`
	Name     string   `json:"name"`
	Fullname string   `json:"fullname"`
	BasedOn  string   `json:"based_on"`
	Arch     []string `json:"arch"`
}

type Hardware struct {
	CPU       string `json:"cpu"`
	Cores     int    `json:"cores"`
	Threads   int    `json:"threads"`
	Mhz       string `json:"mhz"`
	Ram       string `json:"ram"`
	Swap      string `json:"swap"`
	Disk      string `json:"disk"`
	DiskAvail string `json:"disk_available"`
	GPU       string `json:"gpu"`
}

type Software struct {
	Python   string `json:"python"`
	Docker   string `json:"docker"`
	Php      string `json:"php"`
	Composer string `json:"composer"`
	Node     string `json:"node"`
	Npm      string `json:"npm"`
}
