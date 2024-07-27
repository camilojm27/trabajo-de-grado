package types

type Logs struct {
	NodeID      string `json:"node_id"`
	ContainerID string `json:"container_id"`
	Logs        string `json:"logs"`
}
