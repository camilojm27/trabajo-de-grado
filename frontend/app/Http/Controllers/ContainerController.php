<?php

namespace App\Http\Controllers;

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
            'node' => 'required|max:255|uuid',
            'name' => 'required|max:255',
            'image' => 'required|min:5',
            'ports' => 'string'
        ]);


        $container = new Container();
        $container->name = $validated['name'];
        $container->image = $validated['image'];
        $container->ports = $validated['ports'];
        $container->node_id = $validated['node'];
        $container->state = '';
        $container->verified = False;
        $container->save();
        ContainerCreated::dispatch($container);

    }

    /**
     * Display the specified resource.
     */
    public function show(Container $container)
    {
        //
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
