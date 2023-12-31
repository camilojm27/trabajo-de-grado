<?php

namespace App\Http\Controllers;

use App\Events\ContainerCreated;
use App\Models\Container;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Dashboard');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Realizar la validación aparte y enviar los errores correspondientes.
        $validated = $request->validate([
            'name' => 'required|max:255',
            'image' => 'required|min:5',
            'ports' => 'string'
        ]);


        $container = new Container();
        $container->name = $validated['name'];
        $container->image = $validated['image'];
        $container->ports = $validated['ports'];
        $container->status = 'off';
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
