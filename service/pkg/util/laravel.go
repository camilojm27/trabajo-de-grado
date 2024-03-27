package util

import (
	"encoding/json"
	"fmt"
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
