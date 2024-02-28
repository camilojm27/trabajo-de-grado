<?php

namespace App\Http\Controllers;

use App\Enums\ContainerState;
use App\Events\ContainerCreated;
use App\Models\Container;
use App\Models\Node;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
    public function store(Request $request)
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
        ContainerCreated::dispatch($container);
        return to_route('containers.show', $container);

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
