<?php

namespace App\Console\Commands;

use App\Events\ContainerLogsUpdated;
use App\Events\ContainerMetricsUpdated;
use App\Events\NodeMetricsUpdated;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
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
        $this->channel->queue_declare('host-metrics', false, false, false, false);
        $this->channel->queue_declare('containers-metrics', false, false, false, false);
        $this->channel->queue_declare('containers-logs', false, false, false, false);

    }

    private function consumeMessages(): void
    {
        $nodeMetricsCallback = function ($message) {
            try {
                $this->processHostsMetrics($message);
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }
        };

        $containerMetricsCallback = function ($message) {
            try {
                $this->processContainersMetrics($message);
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }
        };

        $containerLogsCallback = function ($message) {
            try {
                $this->processContainersLogs($message);
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }
        };

        $this->channel->basic_consume('host-metrics', '', false, true, false, false, $nodeMetricsCallback);
        $this->channel->basic_consume('containers-metrics', '', false, true, false, false, $containerMetricsCallback);
        $this->channel->basic_consume('containers-logs', '', false, true, false, false, $containerLogsCallback);

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

    private function processContainersLogs($message): void
    {
        $this->warn('Processing container logs');
        $logs = json_decode($message->body, true);
        $containerId = $logs["container_id"];
        $newLogEntry = $logs["logs"];

        $cacheKey = 'container-logs-' . $containerId;
        $previousLogs = Cache::get($cacheKey, '');

        $updatedLogs = $previousLogs . $newLogEntry;

//        $maxLogSize = 10000000;
//        if (strlen($updatedLogs) > $maxLogSize) {
//            $updatedLogs = substr($updatedLogs, -$maxLogSize);
//        }


        Cache::put($cacheKey, $updatedLogs, now()->addMinutes(2));
        event(new ContainerLogsUpdated($newLogEntry, $containerId, $logs["node_id"]));
    }
}
