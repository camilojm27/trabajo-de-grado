package types

type ContainerRequest struct {
	Action string               `json:"action"`
	PID    uint64               `json:"pid"`
	Data   ContainerRequestData `json:"data"`
}

type ContainerRequestData struct {
	Name            string                         `json:"name"`
	Image           string                         `json:"image"`
	NodeID          string                         `json:"node_id"`
	ContainerID     string                         `json:"container_id"`
	Verified        bool                           `json:"verified"`
	Attributes      ContainerRequestDataAttributes `json:"attributes"`
	RemoveContainer struct {
		RemoveVolumes bool `json:"remove_volumes"`
		RemoveLinks   bool `json:"remove_links"`
	}
	StopContainer struct {
		Timeout int `json:"timeout"`
	}
}

type ContainerRequestDataAttributes struct {
    Cmd     string `json:"cmd"`
    Ports   []PortBinding `json:"ports"`
    Env     []struct {
        Name  string `json:"name"`
        Value string `json:"value"`
    } `json:"env"`
    Volumes []string `json:"volumes"`
    AdvancedBools []string `json:"advanced_bools"` // Fixed typo
}

type PortBinding struct {
    HostIP        string `json:"host_ip"`
    HostPort      string `json:"host_port"`
    ContainerPort string `json:"container_port"`
    Protocol      string `json:"protocol"`
}
