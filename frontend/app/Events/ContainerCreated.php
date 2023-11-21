<?php

namespace App\Events;

use App\Models\Container;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContainerCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $container;

    /**
     * Create a new event instance.
     */
    public function __construct(Container $container)
    {
        $this->container = $container->toJson();

    }

//    /**
//     * Get the channels the event should broadcast on.
//     *
//     * @return array<int, \Illuminate\Broadcasting\Channel>
//     */
//    public function broadcastOn(): array
//    {
//        return [
//            new PrivateChannel('channel-name'),
//        ];
//    }
}
