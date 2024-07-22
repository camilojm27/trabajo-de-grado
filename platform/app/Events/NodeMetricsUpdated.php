<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NodeMetricsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $metrics;
    public string $node_id;
    public function __construct($metrics)
    {
       $this->metrics = $metrics;
       $this->node_id = $metrics['node_id'];
       error_log("NodeMetricsUpdated: " . json_encode($metrics));
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('node-metrics-'. $this->node_id);

    }

}
