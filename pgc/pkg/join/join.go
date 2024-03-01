// join/join.go
package join

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/spf13/cobra"
)

func RunJoinCommand(cmd *cobra.Command, args []string, apiEndpoint string, welcomeKey string) {
	// Make HTTP request with the "welcome" key
	url := apiEndpoint

	// Create a JSON payload with the welcome key
	payload := map[string]string{
		"welcome_key": welcomeKey,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("Error creating JSON payload:", err)
		return
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		fmt.Println("Error creating HTTP request:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := http.DefaultClient
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making HTTP request:", err)
		return
	}
	defer resp.Body.Close()
	// 403
	if resp.StatusCode == http.StatusForbidden {
		fmt.Println("Invalid welcome key")
		return
	}
	// 422
	if resp.StatusCode == http.StatusUnprocessableEntity {
		jsonBytes, _ := io.ReadAll(resp.Body)
		jsonString := string(jsonBytes)
		println(jsonString)
		//TODO: util.ParseAndPrintErrors(jsonString)
		return
	}

}
