package services

import (
	"context"
	"fmt"
	"time"

	"github.com/rabbitmq/amqp091-go"
	"github.com/spf13/viper"
)

type RabbitMQClient struct {
	conn         *amqp091.Connection
	ch           *amqp091.Channel
	url          string
	isConnected  bool
	reconnectCh  chan bool
	reconnecting bool
}

func NewRabbitMQClient() (*RabbitMQClient, error) {
	host := viper.GetString("RABBITMQ_HOST")
	port := viper.GetString("RABBITMQ_PORT")
	login := viper.GetString("RABBITMQ_LOGIN")
	password := viper.GetString("RABBITMQ_PASSWORD")

	url := fmt.Sprintf("amqp://%s:%s@%s:%s/", login, password, host, port)

	client := &RabbitMQClient{
		url:         url,
		reconnectCh: make(chan bool),
	}

	err := client.connect()
	if err != nil {
		return nil, err
	}

	go client.handleReconnect()

	return client, nil
}

func (c *RabbitMQClient) connect() error {
	conn, err := amqp091.Dial(c.url)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		return fmt.Errorf("failed to open channel: %w", err)
	}

	c.conn = conn
	c.ch = ch
	c.isConnected = true

	go func() {
		<-c.conn.NotifyClose(make(chan *amqp091.Error))
		c.isConnected = false
		c.reconnectCh <- true
	}()

	return nil
}

func (c *RabbitMQClient) handleReconnect() {
	for range c.reconnectCh {
		if !c.reconnecting {
			c.reconnecting = true
			fmt.Println("Attempting to reconnect to RabbitMQ...")

			for !c.isConnected {
				err := c.connect()
				if err != nil {
					fmt.Printf("Failed to reconnect: %v. Retrying in 5 seconds...\n", err)
					time.Sleep(5 * time.Second)	
				}
			}

			fmt.Println("Reconnected to RabbitMQ")
			c.reconnecting = false
		}
	}
}

func (c *RabbitMQClient) Close() error {
	if c.ch != nil {
		c.ch.Close()
	}
	if c.conn != nil {
		return c.conn.Close()
	}
	return nil
}

func (c *RabbitMQClient) ensureConnected() error {
	if !c.isConnected {
		return fmt.Errorf("not connected to RabbitMQ")
	}
	return nil
}

func (c *RabbitMQClient) Consume(ctx context.Context, queueName string, handler func(d amqp091.Delivery)) error {
	for {
		err := c.ensureConnected()
		if err != nil {
			fmt.Printf("Connection lost, waiting for reconnection: %v\n", err)
			time.Sleep(1 * time.Second)
			continue
		}

		_, err = c.ch.QueueDeclare(
			queueName,
			false, // Durable
			false, // Auto-delete
			false, // Exclusive
			false, // No-wait
			nil,   // Arguments
		)
		if err != nil {
			fmt.Printf("Failed to declare queue: %v. Retrying...\n", err)
			continue
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
			fmt.Printf("Failed to consume messages: %v. Retrying...\n", err)
			continue
		}

		for d := range deliveries {
			handler(d)
		}

		// If we're here, the channel was closed. Wait for reconnection.
		fmt.Println("Consume channel closed. Waiting for reconnection...")
		time.Sleep(1 * time.Second)
	}
}

func (c *RabbitMQClient) Publish(ctx context.Context, exchange, routingKey string, mandatory, immediate bool, publishing amqp091.Publishing) error {
	for {
		err := c.ensureConnected()
		if err != nil {
			fmt.Printf("Connection lost, waiting for reconnection: %v\n", err)
			time.Sleep(1 * time.Second)
			continue
		}

		err = c.ch.PublishWithContext(
			ctx,
			exchange,
			routingKey,
			mandatory,
			immediate,
			publishing,
		)
		if err != nil {
			fmt.Printf("Failed to publish message: %v. Retrying...\n", err)
			continue
		}

		return nil
	}
}
