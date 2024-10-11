package types

type ContainerRequest struct {
	Action string                `json:"action"`
	PID    string                `json:"pid"`
	Data   *ContainerRequestData `json:"data,omitempty"`
}

type HostRequest struct {
	Action string `json:"action"`
	PID    string `json:"pid"`
}

/*
This struct only truly work when creating a container, if you sent other type of action is only required the container_id
and the laravel struct when $container->attributes its not the same, the json key has different name so you have to send only the container_id
*/

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
	Hash string `json:"hash,omitempty"`
}

type ContainerRequestDataAttributes struct {
	//TODO: METRICS:HOST
	//Error parsing JSON: json: cannot unmarshal array into Go struct field ContainerRequest.data of type types.ContainerRequestData
	Cmd   string        `json:"cmd"`
	Ports []PortBinding `json:"ports"`
	Env   []struct {
		Name  string `json:"name"`
		Value string `json:"value"`
	} `json:"env"`
	Volumes       []string `json:"volumes"`
	AdvancedBools []string `json:"advanced_bools"` // Fixed typo
	NetworkName   string   `json:"networkName"`
}

type PortBinding struct {
	HostIP        string `json:"host_ip"`
	HostPort      string `json:"hostPort"`
	ContainerPort string `json:"containerPort"`
	Protocol      string `json:"protocol"`
}
