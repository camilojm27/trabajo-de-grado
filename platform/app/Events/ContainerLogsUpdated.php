<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContainerLogsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $logs;
    public string $container_id;
    public string $node_id;

    public function __construct($logs, $container_id, $node_id)
    {
        $this->logs = $logs;
        $this->container_id = $container_id; // Database id, not container real id
        if (isset($event->node_id)) {
            $this->node_id = $node_id;
        } else {
            $this->node_id = "unknown";
        }
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('container-logs-' . $this->container_id);
    }
}
