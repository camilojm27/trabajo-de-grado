<?php

namespace App\Listeners;

use App\Events\ConsumeGeneralQueue;
use App\Models\Container;
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

    //TODO: Handle errors if a container share the same name, and general errors
    $containers = $event->containers;
    $node_id = $containers['node_id'];

    foreach ($containers['containers'] as $container) {
        $existingContainer = Container::where('container_id', $container["Id"])->first();
        if ($existingContainer !== null) {
            // Update existing record
            $existingContainer->status = $container["Status"];
            $existingContainer->name = $container["Names"][0];
            $existingContainer->verified = true;
            $existingContainer->attributes = json_encode($container);
            $existingContainer->update();
        } else {
            // Create a new record
            $newContainer = new Container();
            $newContainer->container_id = $container["Id"];
            $newContainer->name = $container["Names"][0];
            $newContainer->image = $container['Image'];
            $newContainer->node_id = $node_id;
            $newContainer->status = $container["Status"];
            $newContainer->verified = true;
            $newContainer->attributes = json_encode($container);
            error_log('New container created: ' . $container["Id"] . ' on node: ' . $node_id);

            $newContainer->save();
        }
    }
}

}
