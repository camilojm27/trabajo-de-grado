<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpAmqpLib\Connection\AMQPStreamConnection;

class RabbitMQConsumer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rabbitmq:consume';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Consume messages from RabbitMQ queue';

    /**
     * Execute the console command.
     * @throws \Exception
     */
    public function handle(): void
    {
        $connection = new AMQPStreamConnection(
            'localhost', 5672, 'guest', 'guest'
        );

        $channel = $connection->channel();

        $channel->queue_declare('hello', false, false, false, false);

        $callback = function ($message) {
            $this->info('Received: ' . $message->body);
            // Add your message processing logic here
        };

        $channel->basic_consume('hello', '', false, true, false, false, $callback);

        while ($channel->is_consuming()) {
            $channel->wait();
        }

        $channel->close();
        $connection->close();
    }
}
