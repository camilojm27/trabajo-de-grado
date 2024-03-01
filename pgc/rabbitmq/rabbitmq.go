package rabbitmq

import (
	"context"
	"fmt"
	"pgc/config"

	"github.com/rabbitmq/amqp091-go"
)

type RabbitMQClient struct {
	conn *amqp091.Connection
	ch   *amqp091.Channel
}

func NewRabbitMQClient(config *config.Config) (*RabbitMQClient, error) {
	url := fmt.Sprintf("amqp://%s:%s@%s:%s/", config.Username, config.Password, config.Host, config.Port)
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

func (c *RabbitMQClient) Consume(ctx context.Context, queueName string, handler func(delivery amqp091.Delivery)) error {
	msgs, err := c.ch.Consume(
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

	go func() {
		for d := range msgs {
			handler(d)
		}
	}()

	<-ctx.Done()
	return c.ch.Cancel(queueName, false)
}
