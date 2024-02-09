<?php

namespace App\Console\Commands;

use App\Events\ConsumeGeneralQueue;
use Exception;
use Illuminate\Console\Command;
use PhpAmqpLib\Connection\AMQPStreamConnection;

class RabbitMQConsumer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'amqp:consume';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Consume messages from RabbitMQ queue';

    /**
     * Execute the console command.
     * @throws Exception
     */
    public function handle(): void
    {
        $connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST'), env('RABBITMQ_PORT', 5672), env('RABBITMQ_LOGIN'), env('RABBITMQ_PASSWORD')
        );

        $channel = $connection->channel();

        $channel->queue_declare('general', false, false, false, false);

        $callback = function ($message) {
            $this->info('Received: ' . $message->body);
            $json = json_decode($message->body, true);
            $context = $json['context'];

            switch ($context) {
                case "containers":
                    $this->info('Dispatching event: ' . $json['context']);
                    ConsumeGeneralQueue::dispatch($json);
                    break;
                case "created":
                    break;
            }
        };
        $channel->basic_consume('general', '', false, true, false, false, $callback);
        while ($channel->is_consuming()) {
            //log to console
            $this->info('Waiting for messages...');
            $channel->wait();
        }

        $channel->close();
        $connection->close();
    }
}
