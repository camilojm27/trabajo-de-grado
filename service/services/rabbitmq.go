package services

import (
	"context"
	"fmt"

	"github.com/rabbitmq/amqp091-go"
	"github.com/spf13/viper"
)

type RabbitMQClient struct {
	conn *amqp091.Connection
	ch   *amqp091.Channel
}

func NewRabbitMQClient() (*RabbitMQClient, error) {
	host := viper.GetString("RABBITMQ_HOST")
	port := viper.GetString("RABBITMQ_PORT")
	login := viper.GetString("RABBITMQ_LOGIN")
	password := viper.GetString("RABBITMQ_PASSWORD")

	url := fmt.Sprintf("amqp://%s:%s@%s:%s/", login, password, host, port)
	println(password)
	conn, err := amqp091.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open channel: %w", err)
	}

	return &RabbitMQClient{
		conn: conn,
		ch:   ch,
	}, nil
}

func (c *RabbitMQClient) Close() error {
	if err := c.ch.Close(); err != nil {
		return err
	}
	return c.conn.Close()
}

func (c *RabbitMQClient) Consume(ctx context.Context, queueName string, handler func(d amqp091.Delivery)) error {

	// Declare the queue before consuming
	_, err := c.ch.QueueDeclare(
		queueName,
		false, // Durable
		false, // Auto-delete
		false, // Exclusive
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}

	deliveries, err := c.ch.Consume(
		queueName,
		"",
		true,  // Auto-ack
		false, // Exclusive
		false, // No-local
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages: %w", err)
	}

	for {
		select {
		case d, ok := <-deliveries:
			if !ok {
				// Channel closed, likely due to context cancellation or error
				return nil
			}
			handler(d)
		case <-ctx.Done():
			// Context canceled, stop consuming
			return c.ch.Cancel(queueName, false)
		}
	}
}

func (c *RabbitMQClient) Publish(ctx context.Context, body []byte) error {
	// Check if channel is open before using it
	if c.ch.IsClosed() {
		return fmt.Errorf("failed to publish message: channel closed")
	}

	err := c.ch.PublishWithContext(
		ctx,
		"",        // Exchange
		"general", // Routing key
		false,     // Mandatory
		false,     // Immediate
		amqp091.Publishing{
			ContentType: "application/json", // Adjust content type based on your message
			Body:        body,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	return nil
}
