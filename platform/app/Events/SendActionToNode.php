<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use InvalidArgumentException;

//TODO: add rabbitmq options like durable, auto_delete, etc

class SendActionToNode
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $payload;

    public string $routingKey;

    public string $action;

    /**
     * Create a new event instance.
     *
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
     * @throws InvalidArgumentException
     */
    private function validateModelData(array $modelData): void
    {
        if (! isset($modelData['pid'])) {
            throw new InvalidArgumentException('Model data must contain "pid" and "data" keys');
        }
    }

    /**
     * Set the payload.
     */
    private function setPayload(array $modelData, string $action): void
    {
        if (! isset($modelData['data'])) {
            $this->payload = json_encode([
                'action' => $action,
                'pid' => $modelData['pid'],
            ]);

            return;
        }

        $this->payload = json_encode([
            'action' => $action,
            'pid' => $modelData['pid'],
            'data' => $modelData['data'],
        ]);
    }

    /**
     * Set the routing key.
     */
    private function setRoutingKey(array $modelData): void
    {
        if (isset($modelData['node_id'])) {
            $this->routingKey = $modelData['node_id'];
        } else {
            throw new InvalidArgumentException('Unable to determine routing key');
        }
    }
}
