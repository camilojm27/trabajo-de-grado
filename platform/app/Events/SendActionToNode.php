<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use InvalidArgumentException;

class SendActionToNode
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $payload;
    public string $routingKey;
    public string $action;

    /**
     * Create a new event instance.
     *
     * @param array $modelData
     * @param string $action
     * @throws InvalidArgumentException
     */
    public function __construct(array $modelData, string $action)
    {
        $this->validateModelData($modelData);
        $this->setPayload($modelData, $action);
        $this->setRoutingKey($modelData);
    }

    /**
     * Validate the model data.
     *
     * @param array $modelData
     * @throws InvalidArgumentException
     */
    private function validateModelData(array $modelData): void
    {
        if (!isset($modelData['pid']) || !isset($modelData['data'])) {
            throw new InvalidArgumentException('Model data must contain "pid" and "data" keys');
        }
    }

    /**
     * Set the payload.
     *
     * @param array $modelData
     * @param string $action
     */
    private function setPayload(array $modelData, string $action): void
    {
        $this->payload = json_encode([
            "action" => $action,
            "pid" => $modelData['pid'],
            "data" => $modelData['data']
        ]);
    }

    /**
     * Set the routing key.
     *
     * @param array $modelData
     */
    private function setRoutingKey(array $modelData): void
    {
        if (isset($modelData['node_id'])) {
            $this->routingKey = $modelData['node_id'];
        } elseif (isset($modelData['data']['node_id'])) {
            $this->routingKey = $modelData['data']['node_id'];
        } else {
            throw new InvalidArgumentException('Unable to determine routing key');
        }
    }
}
