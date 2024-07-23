<?php

namespace App\Listeners;

use App\Events\ContainerMetricsUpdated;
use App\Events\ContainerProcessed;
use App\Events\NodeMetricsUpdated;
use Auth;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Cache;

class UpdateNodeOnlineStatus
{
    private function setOnline(string $id): void
    {
        Cache::put('node-online-' . $id, true, now()->addMinutes(2));
    }

    /**
     * Handle user NodeMetricsEvents events.
     */
    public function handleNodeMetricsUpdated(NodeMetricsUpdated $event): void {
        $this->setOnline($event->node_id);
    }

    /**
     * Handle user Container events.
     */
    public function handleContainerProcessed(ContainerProcessed $event): void {
        $this->setOnline($event->node_id);
    }

    public function handleContainerMetricsUpdated(ContainerMetricsUpdated $event): void {
        $this->setOnline($event->node_id);
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            NodeMetricsUpdated::class => 'handleNodeMetricsUpdated',
            ContainerProcessed::class => 'handleContainerProcessed',
            ContainerMetricsUpdated::class => 'handleContainerMetricsUpdated',
        ];
    }
}
