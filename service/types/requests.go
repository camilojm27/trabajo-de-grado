package types

type ContainerRequest struct {
	Action string `json:"action"`
	PID    uint64 `json:"pid"`
	Data   struct {
		Name        string `json:"name"`
		Image       string `json:"image"`
		NodeID      string `json:"node_id"`
		ContainerID string `json:"container_id"`
		Attributes  struct {
			Ports []string `json:"ports"`
			Env   []struct {
				Name  string `json:"name"`
				Value string `json:"value"`
			} `json:"env"`
			Volumes       []string `json:"volumes"`
			AdvancedBools []string `json:"avanced_bools"` // Note: Typo
		} `json:"attributes"`
		Verified        bool `json:"verified"`
		RemoveContainer struct {
			RemoveVolumes bool `json:"remove_volumes"`
			RemoveLinks   bool `json:"remove_links"`
		}
		StopContainer struct {
			Timeout int `json:"timeout"`
		}
	} `json:"data"`
}
