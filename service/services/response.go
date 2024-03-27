package services

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/spf13/viper"
)

var NodeID = viper.GetString("NODE_ID")

func Response(ctx context.Context, client *RabbitMQClient, payload Payload, action string, platformID uint64, err error) {
	if err != nil {
		fmt.Printf("Error During %s: %v\n", action, err)

		response := ResponseMsg{
			Action:  action,
			Stataus: "error",
			Error:   err.Error(),
			Data:    payload,
			PID:     platformID,
			NodeID:  NodeID,
		}
		sendResponse(ctx, response, client)
		return
	}

	response := ResponseMsg{
		Action:  action,
		Stataus: "success",
		Error:   "",
		Data:    payload,
		PID:     platformID,
		NodeID:  NodeID,
	}
	sendResponse(ctx, response, client)

}

func sendResponse(ctx context.Context, response ResponseMsg, client *RabbitMQClient) {

	defer client.Close()
	//TODO: Context

	jsonDataBytes, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}
	err = client.Publish(ctx, jsonDataBytes)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("Response sent for %s\n", response.Action)
}

type ResponseMsg struct {
	Action  string  `json:"action"`
	Data    Payload `json:"data"`
	Stataus string  `json:"status"`
	PID     uint64  `json:"pid"`
	NodeID  string  `json:"node_id"`
	Error   string  `json:"error"`
}

type Payload interface{}
