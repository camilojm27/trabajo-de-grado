<?php
namespace App\Events;

use App\Models\Container;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendCreateContainer
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $payload;
    public string $routing_key;

    /**
     * Create a new event instance.
     */
    public function __construct(array $modelData, string $action)
    {
        $this->payload = json_encode([
            "action" => $action,
            "pid" => $modelData['pid'],
            "data" => $modelData['data']
        ]);
        $this->routing_key = $modelData['data']['node_id'];
    }
}

