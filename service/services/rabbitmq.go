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

	deliveries, err := c.ch.ConsumeWithContext(
		ctx,
		queueName,
		"",
		false, // Auto-ack
		false, // Exclusive
		false, // No-local
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages: %w", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range deliveries {
			handler(d) // Call the provided handler function
		}
	}()

	fmt.Println("Waiting for messages")
	<-forever // Block until the context is cancelled or a signal is received

	return nil
}

func (c *RabbitMQClient) Publish(ctx context.Context, exchange, routingKey string, mandatory, immediate bool, publishing amqp091.Publishing) error {
	// Check if channel is open before using it
	// TODO: Does it create the queue or needs to be declared before?
	if c.ch.IsClosed() {
		//TODO: What to do if the channel is closed?,
		//this can happen if the username is deleted from the RabbitMQ management console
		return fmt.Errorf("failed to publish message: channel closed")
	}

	err := c.ch.PublishWithContext(
		ctx,
		exchange,
		routingKey,
		mandatory,
		immediate,
		publishing,
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	return nil
}
