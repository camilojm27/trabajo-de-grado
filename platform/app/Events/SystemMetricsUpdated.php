<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SystemMetricsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $metrics;

    public function __construct($metrics)
    {
       $this->metrics = $metrics;
       error_log("SystemMetricsUpdated: " . json_encode($metrics));
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('container-metrics'. 1);
        //return new PrivateChannel('container-metrics'. $this->metrics['container_id']);

    }

}
