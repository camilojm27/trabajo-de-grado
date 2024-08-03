<?php

namespace App\Http\Controllers;

use App\Enums\NodeActions;
use App\Events\SendActionToNode;
use App\Http\Requests\StoreNodeRequest;
use App\Models\Node;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class NodeController extends Controller
{
    private function getAllUserNodes(): Collection
    {
        $user = Auth::user();

        $nodes = Node::where('created_by', $user->id)->with('creator') // Get nodes created by the user
            ->orWhereHas('users', function ($query) use ($user) { // Get nodes the user has access to
                $query->where('user_id', $user->id);
            })->get();

        return $nodes;
    }

    private function getMyNodes(): Collection
    {
        $user = Auth::user();

        return Node::where('created_by', $user->id)->with('creator')->get();
    }

    private function getSystemNodes(): Collection
    {
        //TODO: This check if user is admin
        return Node::all()->load('creator');
    }

    /**
     * Display the listing of Nodes a user has access.
     */
    public function index(Request $request, $id = null): \Inertia\Response
    {
        $selectedNode = $id ? Node::with('users')->findOrFail($id) : null;

        return Inertia::render('Nodes/Nodes', [
            'auth' => [
                'user' => $request->user(),
            ],
            'systemNodes' => [], //$this->getSystemNodes(),
            'allUserNodes' => $this->getAllUserNodes(),
            'myNodes' => $this->getMyNodes(),
            'selectedNode' => $selectedNode,
            'params' => [
                'id' => $id,
            ],
        ]);
    }

    public function addUserToNode(Request $request, Node $node)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email|not_in:'.$node->users->pluck('email')->implode(','),
        ]);

        $user = User::where('email', $validated['email'])->first();
        $node->users()->attach($user);

        return back()->with('success', 'User added successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNodeRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['created_by'])->first();

        if (! $user) {
            return response()->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $validated['created_by'] = $user->id;

        Log::info('Creating node with data:', $validated);

        $node = Node::create($validated);

        // Associate the creating user with the node
        $node->users()->attach($user->id);

        return response()->json(['id' => $node->id], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @deprecated
     */
    public function show(Node $node): \Inertia\Response
    {
        return Inertia::render('Nodes/NodeDetail', [
            'node' => $node,
        ]);
    }
    public function showCredentials(Node $node)
    {
        try {
            // Define las credenciales del nuevo usuario
            $user = $node->id;
            $password = Str::password(32, true, true, false, false);
            $tags = 'None';
            $rmqhost = env('RABBITMQ_HOST', 'localhost');
            // Define las credenciales del administrador de RabbitMQ
            $adminUser = env('RABBITMQ_LOGIN', 'guest');
            $adminPassword = env('RABBITMQ_PASSWORD', 'guest');
            $rmqvhost = env('RABBITMQ_VHOST', '/');

            // Define la URL de la API de RabbitMQ
            $url = $rmqhost . ':15672/api/users/' . $user;

            // Crea el nuevo usuario
            $response = Http::withBasicAuth($adminUser, $adminPassword)
                ->put($url, [
                    'password' => $password,
                    'tags' => $tags,
                ]);
            if ($response->failed()) {
                return response()->json(['error' => 'Error creating user'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            $url = $rmqhost . ':15672/api/permissions/' . urlencode($rmqvhost) . '/' . $user;
            $response = Http::withBasicAuth($adminUser, $adminPassword)
                ->put($url, [
                    'configure' => "^{$user}$",
                    'write' => '.*',
                    'read' => '.*'
                ]);
            if ($response->failed()) {
                return response()->json(['error' => 'Error setting permissions'], Response::HTTP_INTERNAL_SERVER_ERROR);
            } elseif ($response->status() == 201 or $response->status() == 204) {
                $credentials = [
                    'RABBITMQ_HOST' => $rmqhost,
                    'RABBITMQ_PORT' => env('RABBITMQ_PORT', 5672),
                    'RABBITMQ_LOGIN' => $user,
                    'RABBITMQ_PASSWORD' => $password,
                    'RABBITMQ_VHOST' => $rmqvhost,
                ];

                return response()->json($credentials, Response::HTTP_OK);
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            error_log($e->getTraceAsString());
        }
    }

    public function metrics(Node $node): void
    {
        SendActionToNode::dispatch([
            //TODO: If i dont send the pid, the event is not dispatched, but the pid inside the event is for containers
            // not for nodes, so i need to change the event to accept a node_id instead of pid
            "pid" => 00,
            "node_id" => $node->id,
            "data" => null
        ], "METRICS:HOST");
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
        ///api/users/bulk-delete
        /// {"users" : ["user1", "user2", "user3"]}
    }

    public function exist()
    {
    }
}
