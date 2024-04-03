<?php

namespace App\Listeners;

use App\Events\SendCreateContainer;
use App\Models\Container;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use stdClass;

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
    public function handle(SendCreateContainer $event): void
    {
        $connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST'), env('RABBITMQ_PORT', 5672), env('RABBITMQ_LOGIN'), env('RABBITMQ_PASSWORD')
        );

        $channel = $connection->channel();

        $channel->queue_declare($event->routing_key, false, false, false, false);
        $message = new AMQPMessage($event->payload);
        $channel->basic_publish($message, '', $event->routing_key);

        $channel->close();
        $connection->close();
    }
}
