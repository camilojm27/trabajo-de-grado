package cmd

import (
	"context"
	"fmt"
	"log"
	"pgc/config"
	"pgc/rabbitmq"

	"github.com/rabbitmq/amqp091-go"
	"github.com/spf13/cobra"
)

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("start called")
		// Load configuration
		config, err := config.LoadConfig()
		if err != nil {
			log.Fatal(err)
		}

		// Create RabbitMQ client
		client, err := rabbitmq.NewRabbitMQClient(&config)
		if err != nil {
			log.Fatal(err)
		}
		defer client.Close()

		// Define context for graceful shutdown
		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		// Define message handler function (replace with your actual logic)
		handler := func(d amqp091.Delivery) {
			fmt.Printf("Received message: %s\n", d.Body)
		}

		// Start consuming messages
		if err := client.Consume(ctx, "9b685504-5099-4cb3-933c-54ad094894e0", handler); err != nil {
			log.Fatal(err)
		}

		log.Printf("Listening for messages on queue: my_queue")

		// Wait for termination signal (e.g., SIGINT)
		select {}
	},
}

func init() {
	rootCmd.AddCommand(startCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// startCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// startCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
