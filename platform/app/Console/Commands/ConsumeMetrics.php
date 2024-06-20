<?php

namespace App\Console\Commands;

use App\Events\ContainerMetricsUpdated;
use App\Events\NodeMetricsUpdated;
use Exception;
use Illuminate\Console\Command;
use PhpAmqpLib\Channel\AbstractChannel;
use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPStreamConnection;

class ConsumeMetrics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'amqp:metrics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    private AbstractChannel|AMQPChannel $channel;

    public function handle(): void
    {
        $this->establishRabbitMQConnection();
        $this->setupQueue();
        $this->consumeMessages();
    }


    private function establishRabbitMQConnection(): void
    {
        try {
            $connection = new AMQPStreamConnection(
                env('RABBITMQ_HOST'), env('RABBITMQ_PORT', 5672), env('RABBITMQ_LOGIN'), env('RABBITMQ_PASSWORD')
            );
            $this->channel = $connection->channel();
        } catch (Exception $e) {
            $this->error('Failed to connect to RabbitMQ: ' . $e->getMessage());
            exit(1); // Terminate with error
        }
    }

    private function setupQueue(): void
    {
        $this->channel->queue_declare('metrics', false, false, false, false);
        $this->channel->queue_declare('containers-metrics', false, false, false, false);
    }

    private function consumeMessages(): void
    {
        $primaryCallback = function ($message) {
            try {
                $this->processHostsMetrics($message);
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }
        };

        $secondaryCallback = function ($message) {
            try {
                $this->processContainersMetrics($message);
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }
        };

        $this->channel->basic_consume('metrics', '', false, true, false, false, $primaryCallback);
        $this->channel->basic_consume('containers-metrics', '', false, true, false, false, $secondaryCallback);

        while ($this->channel->is_consuming()) {
            $this->info('Waiting for messages...');
            $this->channel->wait();
        }
    }

    private function processHostsMetrics($message): void
    {
        event(new NodeMetricsUpdated(json_decode($message->body, true)));
    }
    private function processContainersMetrics($message): void
    {
        event(new ContainerMetricsUpdated(json_decode($message->body, true)));
    }
}
