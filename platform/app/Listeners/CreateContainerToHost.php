<?php

namespace App\Listeners;

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
    public function handle(object $event): void
    {
        $container = new Container($event->container->attributesToArray());
        $payload = [
            "action" => "CREATE",
            "model" => "container",
            "data" => $container,
        ];
        $payload = json_encode($payload);
        $routing_key = $container->node_id;
        error_log($payload);
        Log::info($payload);


        $connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST'), env('RABBITMQ_PORT', 5672), env('RABBITMQ_LOGIN'), env('RABBITMQ_PASSWORD')
        );

        $channel = $connection->channel();

        $channel->queue_declare($routing_key, false, false, false, false);
        $message = new AMQPMessage($payload);
        $channel->basic_publish($message, '', $routing_key);

        $channel->close();
        $connection->close();
    }
}
