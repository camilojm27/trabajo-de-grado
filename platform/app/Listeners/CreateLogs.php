<?php

namespace App\Listeners;

use App\Events\ContainerMetricsUpdated;
use App\Events\ContainerProcessed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateLogs
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ContainerMetricsUpdated $event): void
    {
        //
    }
}
