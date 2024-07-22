package join

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/camilojm27/trabajo-de-grado/service/services/system"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type payloadType struct {
	WelcomeKey string `json:"welcome_key"`
	Hostname   string `json:"hostname"`
	Attributes string `json:"attributes"`
	UserEmail  string `json:"created_by"`
}

func RunJoinCommand(cmd *cobra.Command, args []string, apiEndpoint string, welcomeKey string, userEmail string) {
	url := apiEndpoint + "/api/nodes/"
	hostname := viper.GetString("HOSTNAME")

	payload := payloadType{
		WelcomeKey: welcomeKey,
		Hostname:   hostname,
		Attributes: system.Data,
		UserEmail:  userEmail,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		log.Fatalf("Error creating JSON payload: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		log.Fatalf("Error creating HTTP request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := http.DefaultClient
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Error making HTTP request: %v", err)
	}
	defer resp.Body.Close()

	switch resp.StatusCode {
	case http.StatusForbidden: //403
		log.Println("Invalid welcome key")
		return
	case http.StatusUnprocessableEntity: //422
		jsonBytes, _ := io.ReadAll(resp.Body)
		jsonString := string(jsonBytes)
		log.Println(jsonString)
		//TODO: util.ParseAndPrintErrors(jsonString)
		return
	case http.StatusCreated: //201
		var jsonNodeID struct {
			NodeID string `json:"id"`
		}
		err := json.NewDecoder(resp.Body).Decode(&jsonNodeID)
		if err != nil {
			log.Fatalf("Error saving the Node ID: %v", err)
		}
		fmt.Printf("Node ID -> %s \n", jsonNodeID.NodeID)
		viper.Set("NODE_ID", jsonNodeID.NodeID)
		viper.WriteConfig()
		getCredentials(jsonNodeID.NodeID, apiEndpoint)

	default:
		//TODO: Make this a util function
		fmt.Println("Error creating post:", resp.Status)
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(string(body))
	}
}

func getCredentials(nodeID string, apiEndpoint string) {
	url := apiEndpoint + "/api/nodes/credentials/" + nodeID

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatalf("Error creating HTTP request for credentials: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := http.DefaultClient
	credResp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Error making request for credentials: %v", err)
	}
	defer credResp.Body.Close()

	var credentials struct {
		RabbitmqHost     string `json:"RABBITMQ_HOST"`
		RabbitmqPort     string `json:"RABBITMQ_PORT"`
		RabbitmqLogin    string `json:"RABBITMQ_LOGIN"`
		RabbitmqPassword string `json:"RABBITMQ_PASSWORD"`
		RabbitmqVhost    string `json:"RABBITMQ_VHOST"`
	}

	err = json.NewDecoder(credResp.Body).Decode(&credentials)
	if err != nil {
		log.Fatalf("Error saving the Credentials: %v", err)
	}

	switch credResp.StatusCode {
	case http.StatusOK: //200
		fmt.Println("Node joined successfully")
		fmt.Println(credentials)
		viper.Set("RABBITMQ_HOST", credentials.RabbitmqHost)
		viper.Set("RABBITMQ_PORT", credentials.RabbitmqPort)
		viper.Set("RABBITMQ_LOGIN", credentials.RabbitmqLogin)
		viper.Set("RABBITMQ_PASSWORD", credentials.RabbitmqPassword)
		viper.Set("RABBITMQ_VHOST", credentials.RabbitmqVhost)
		viper.WriteConfig()

	default:
		fmt.Println("Error creating post:", credResp.Status)
	}
}
