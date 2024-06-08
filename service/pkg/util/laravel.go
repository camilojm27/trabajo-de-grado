package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func ParseAndPrintErrors(jsonString string) {
	var data map[string]interface{}

	err := json.Unmarshal([]byte(jsonString), &data)
	if err != nil {
		fmt.Println("Error unmarshaling JSON:", err)
		return
	}

	errors, ok := data["errors"].(map[string][]interface{})
	if !ok {
		fmt.Println("Property 'errors' not found or not a map")
		return
	}

	printErrors(errors)
}

// printErrors iterates through the error map and prints them.
func printErrors(errors map[string][]interface{}) {
	for field, errorList := range errors {
		for _, errorStr := range errorList {
			if errorStr, ok := errorStr.(string); ok {
				fmt.Printf("Error for field '%s': %s\n", field, errorStr)
			} else {
				fmt.Printf("Error for field '%s': (unexpected type: %T)\n", field, errorStr)
			}
		}
	}
}

func SendData(url string, data interface{}) error {
	// Marshal the data into JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("error marshalling data: %v", err)
	}

	// Create a new HTTP POST request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("error creating HTTP request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	// Send the request
	client := http.DefaultClient
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error making HTTP request: %v", err)
	}
	defer resp.Body.Close()

	// Check the response status
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return nil
}
