<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
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
    public function handle(object $event): void
    {
        $container = $event->container;

        //TODO: Use .env values
        $connection = new AMQPStreamConnection(
            'localhost', 5672, 'guest', 'guest'
        );

        $channel = $connection->channel();

        $channel->queue_declare('my_queue', false, false, false, false);
        $message = new AMQPMessage($container);
        error_log($container);
        Log::info($container);
        $channel->basic_publish($message, 'amq.direct', 'my_queue');

        $channel->close();
        $connection->close();
    }
}
