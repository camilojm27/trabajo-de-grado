<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNodeRequest;
use App\Models\Node;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class NodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Nodes', [
            'nodes' => Node::all(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNodeRequest $request): JsonResponse
    {
        $validated = $request->safe(['hostname', 'ip_address']);
        $node = new Node();
        $node->fill($validated);
        $node->save();
        return response()->json(['id' => $node->id], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Node $node): \Inertia\Response
    {
        return Inertia::render('NodeDetail', [
            'node' => $node,
        ]);
    }
    public function showCredentials(Node $node)
    {
        // Define las credenciales del nuevo usuario
        $user = $node->id;
        $password = Str::password();
        $tags = 'None';
        $rmqhost = env('RABBITMQ_HOST', 'localhost');
        // Define las credenciales del administrador de RabbitMQ
        $adminUser = env('RABBITMQ_LOGIN', 'guest');
        $adminPassword = env('RABBITMQ_PASSWORD', 'guest');

        // Define la URL de la API de RabbitMQ
        $url = $rmqhost.':15672/api/users/' . $user;

        // Crea el nuevo usuario
        $response = Http::withBasicAuth($adminUser, $adminPassword)
            ->put($url, [
                'password' => $password,
                'tags' => $tags,
            ]);
        if ($response->failed()) {
            return response()->json(['error' => 'Error creating user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        elseif ($response->status() == 201 or $response->status() == 204) {
            $credentials = [
                'RABBITMQ_HOST' => $rmqhost,
                'RABBITMQ_PORT' => env('RABBITMQ_PORT', 5672),
                'RABBITMQ_LOGIN' => $user,
                'RABBITMQ_PASSWORD' => $password,
                'RABBITMQ_VHOST' => env('RABBITMQ_VHOST', '/'),
            ];

            return response()->json($credentials, Response::HTTP_OK);
        }


    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Node $node)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Node $node)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Node $node)
    {
        //
    }
}
