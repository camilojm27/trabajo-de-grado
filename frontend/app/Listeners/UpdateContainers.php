<?php

namespace App\Listeners;

use App\Events\ConsumeGeneralQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateContainers
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
    public function handle(ConsumeGeneralQueue $event): void
    {
        $containers = $event->containers;
        $node_id = $containers['node_id'];
        foreach ($containers['containers'] as $container) {

        }



//
//        $file = fopen('storage/app/' . 'hola'. '.json', 'w');
//        fwrite($file, json_encode($json));
//        fclose($file);
    }
}
