<?php

namespace App\Console\Commands;

use App\Enums\ContainerState;
use App\Models\Container;
use Exception;
use Illuminate\Console\Command;
use PhpAmqpLib\Channel\AbstractChannel;
use PhpAmqpLib\Channel\AMQPChannel;
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
    private AbstractChannel|AMQPChannel $channel;

    /**
     * Execute the console command.
     * @throws Exception
     */
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
        $this->channel->queue_declare('general', false, true, false, false);
    }

    private function consumeMessages(): void
    {
        $this->channel->basic_consume('general', '', false, true, false, false, function ($message) {
            try {
                $this->processMessage($message);
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }
        });

        while ($this->channel->is_consuming()) {
            $this->info('Waiting for messages...');
            $this->channel->wait();
        }
    }

    private function processMessage($message): void
    {
        $messageData = $this->parseMessage($message);
        $this->dispatchAction($messageData['action'], $messageData);
    }

    private function parseMessage($message): array
    {
        $body = $message->body;
        $json = json_decode($body, true);
        return [
            'action' => $json['action'],
            'status' => $json['status'],
            'error' => $json['error'],
            'data' => $json['data'],
            'platform_model_id' => $json['pid'],
            'node_id' => $json['node_id'],
        ];
    }

    private function dispatchAction(string $action, array $messageData): void
    {
        $this->info('Dispatching event: ' . $action);

        switch ($action) {
            case 'LIST:CONTAINERS':
                $this->handleListContainersAction($messageData);
                break;
            case 'CREATE:CONTAINER':
                $this->handleContainerAction($messageData, 'created');
                break;
            case 'DELETE:CONTAINER':
                $this->handleContainerAction($messageData, 'deleted');
                break;
            case 'STOP:CONTAINER':
                $this->handleContainerAction($messageData, 'stopped');
                break;
            case 'KILL:CONTAINER':
                $this->handleContainerAction($messageData, 'killed');
                break;
            case 'START:CONTAINER':
                $this->handleContainerAction($messageData, 'started');
                break;
            case 'RESTART:CONTAINER':
                $this->handleContainerAction($messageData, 'restarted');
                break;
            case 'PAUSE:CONTAINER':
                $this->handleContainerAction($messageData, 'paused');
                break;
            case 'UNPAUSE:CONTAINER':
                $this->handleContainerAction($messageData, 'unpaused');
                break;
        }
    }

    private function handleContainerAction(array $messageData, string $actionVerb): void
    {
        $container = Container::where('id', $messageData['platform_model_id'])->first();

        if ($messageData['status'] === 'error') {
            $this->handleContainerError($container, $messageData['error']);
        } else if ($messageData['status'] === 'success') {
            if ($actionVerb === 'deleted') {
                $container->delete();
            } else {
                $container->status = ContainerState::SUCCESS;
                $container->state = $messageData["data"]["State"]["Status"];
                $container->error = null;
                $container->attributes = $messageData['data'];
                $container->verified = true;
                $container->save();
            }


            $this->info('Container ' . $actionVerb . ', action ' . $messageData['action']);
        }
    }

    private function handleContainerError(Container $container, ?string $error): void
    {
        $container->status = ContainerState::ERROR;
        $container->error = $error;
        $container->save();
        $this->info('Container stored');

    }

    private function handleListContainersAction(array $messageData)
    {
        $this->info(json_encode( $messageData, true) );
        $containers = json_decode($messageData['data'], true);
        $node_id = $messageData['node_id'];
        foreach ($containers as $container) {
            $existingContainer = Container::where('container_id', $container["Id"])->first();
            if ($existingContainer !== null) {
                // Update existing record
                $existingContainer->state = $container["Status"];
                $existingContainer->name = $container["Names"][0];
                $existingContainer->verified = true;
                $existingContainer->attributes = $container;
                $existingContainer->update();
            } else {
                // Create a new record
                $newContainer = new Container();
                $newContainer->container_id = $container["Id"];
                $newContainer->name = $container["Names"][0];
                $newContainer->image = $container['Image'];
                $newContainer->node_id = $node_id;
                $newContainer->state = $container["State"];
                $newContainer->verified = true;
                $newContainer->attributes = $container;
                error_log('New container created: ' . $container["Id"] . ' on node: ' . $node_id);

                $newContainer->save();
            }
        }
    }
}
