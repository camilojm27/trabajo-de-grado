<?php

namespace App\Http\Controllers;

use App\Events\ContainerProcessed;
use App\Events\SendCreateContainer;
use App\Http\Requests\StoreContainerRequest;
use App\Models\Container;
use App\Models\Node;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
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

    public function store(StoreContainerRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $container = Container::create([
                'name' => $validated['name'],
                'image' => $validated['image'],
                'node_id' => $validated['node'],
                'attributes' => $validated['attributes'],
                'state' => 'send',
                'verified' => false,
            ]);

            //ContainerProcessed::dispatch();

            SendCreateContainer::dispatch([
                "node_id" => $validated['node'],
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "CREATE:CONTAINER");
            //TODO: SEND A REDIRECT
            return Inertia::render('Container/Create', [
                'success' => 'Post created successfully!',
                'container_id' => $container->id,
            ]);

        });
    }

    public function recreate(Container $container): void
    {
        //TODO: Make sure we can recreate all containers
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

    public function restart(Container $container)
    {

        try {
            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "RESTART:CONTAINER");
            //TODO: Implement a better way to handle send state
            $container->state = "send";
            $container->verified = False;
            $container->save();
            //return data to show a toast message
            return Redirect::back()->with([
                'title' => 'Container restarted',
                'description' => 'The container is being restarted.'
            ], 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());
        }
    }

    public function start(Container $container): RedirectResponse
    {

        try {

            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "START:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();

            return Redirect::back()->with([
                'title' => 'Container Started',
                'description' => 'The container is being restarted.'
            ], 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());

            return Redirect::back()->with([
                'title' => 'Error',
                'description' => $e->getMessage()
            ], 500);
        }
    }

    public function stop(Container $container): RedirectResponse
    {

        try {

            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "STOP:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();

            return Redirect::back()->with([
                'title' => 'Container Stopped',
                'description' => 'The container is being restarted.'
            ], 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());

            return Redirect::back()->with([
                'title' => 'Error',
                'description' => $e->getMessage()
            ], 500);
        }
    }

    public function kill(Container $container): RedirectResponse
    {
        try {
            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "KILL:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();

            return Redirect::back()->with([
                'title' => 'Container Stopped',
                'description' => 'The container is being restarted.'
            ], 200);

        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());

            return Redirect::back()->with([
                'title' => 'Error',
                'description' => $e->getMessage()
            ], 500);
        }
    }

    public function pause(Container $container): RedirectResponse
    {
        try {

            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "PAUSE:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();

            return Redirect::back()->with([
                'title' => 'Container Paused',
                'description' => 'The container is being restarted.'
            ], 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());

            return Redirect::back()->with([
                'title' => 'Error',
                'description' => $e->getMessage()
            ], 500);
        }
    }

    public function unpause(Container $container): RedirectResponse
    {
        try {

            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "UNPAUSE:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();

            return Redirect::back()->with([
                'title' => 'Container UnPaused',
                'description' => 'The container is being restarted.'
            ], 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());

            return Redirect::back()->with([
                'title' => 'Error',
                'description' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Container $container): \Inertia\Response
    {
        //Return inertia render and the container

        return Inertia::render('Container/Show', [
            'container' => $container->load('node')
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
    public function destroy(Container $container): RedirectResponse
    {
        //TODO: If the container has and error and send state delete it without dispatching the event
        try {
            SendCreateContainer::dispatch([
                "pid" => $container->id,
                "data" => $container->attributesToArray()
            ], "DELETE:CONTAINER");
            $container->state = "send";
            $container->verified = False;
            $container->save();

            return Redirect::back()->with([
                'title' => 'Container Deleted',
                'description' => 'The container is being restarted.'
            ], 200);
        }
        catch (\Exception $e) {
            error_log($e->getMessage());
            Log::error($e->getMessage());
            dump($e->getMessage());

            return Redirect::back()->with([
                'title' => 'Error',
                'description' => $e->getMessage()
            ], 500);
        }
    }

    public function metrics(Container $container): void
    {
        SendCreateContainer::dispatch([
            //TODO: Improve this
            "pid" => 00,
            "node_id" => $container->node_id,
            "data" => $container->attributesToArray()
        ], "METRICS:CONTAINER");
    }
}