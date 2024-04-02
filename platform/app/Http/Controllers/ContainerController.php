<?php

namespace App\Http\Controllers;

use App\Enums\ContainerState;
use App\Events\ContainerProcessed;
use App\Events\SendCreateContainer;
use App\Models\Container;
use App\Models\Node;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class ContainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {

        return Inertia::render('Container/Containers', [
            'containers' => Container::with('node')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Container/Create', [
            'nodes' => Node::all()
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {

        //TODO: Create a proper requeste
        //Realizar la validación aparte y enviar los errores correspondientes.
        $validated = $request->validate([
            'node' => 'required|uuid',
            'name' => 'required',
            'image' => 'required',
            'attributes' => 'required',
        ]);

        $container = new Container();
        $container->name = $validated['name'];
        $container->image = $validated['image'];
        $container->node_id = $validated['node'];
        $container->attributes = $validated['attributes'];
        $container->state = "send";
        $container->verified = False;
        $container->save();
        ContainerProcessed::dispatch();
        try {
            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "CREATE:CONTAINER");
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            $container->delete();
            return to_route('containers.show', 00);

        }
        return to_route('containers.show', $container);

    }

    public function start(Container $container): void
    {

        $payload = [
            "pid" => $container->id,
            "container_id" => $container->container_id,
            "node_id" => $container->node_id,
        ];
        SendCreateContainer::dispatch($payload, "START:CONTAINER");
    }
    public function recreate(Container $container): void
    {
        try {
            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "CREATE:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Container $container): \Inertia\Response
    {
        //Return inertia render and the container

        return Inertia::render('Container/Show', [
            'container' => $container
        ]);

    }


    /**
     * Display the specified resource.
     */
    public function showNode(Node $node): \Inertia\Response
    {
        return Inertia::render('Container/Containers', [
            'containers' => Container::where('node_id', $node->id)->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Container $container)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Container $container)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Container $container)
    {
        //
    }
}
