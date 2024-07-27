<?php

namespace App\Listeners;

use App\Events\SendActionToNode;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class CreateContainerToHost
{
//    /**
//     * Create the event listener.
//     */
//    public function __construct()
//    {
//        //
//    }

    /**
     * Handle the event.
     * @throws \Exception
     */
    public function handle(SendActionToNode $event): void
    {
        $connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST'), env('RABBITMQ_PORT', 5672), env('RABBITMQ_LOGIN'), env('RABBITMQ_PASSWORD')
        );

        $channel = $connection->channel();

        $channel->queue_declare($event->routingKey, false, false, false, false);
        $message = new AMQPMessage($event->payload);
        $channel->basic_publish($message, '', $event->routingKey);

        $channel->close();
        $connection->close();
    }
}
