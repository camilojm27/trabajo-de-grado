<?php

namespace App\Services;

use App\Enums\NodeActions;
use App\Events\SendActionToNode;
use App\Models\Node;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class NodeService
{
    public function getAllUserNodes(): Collection
    {
        $user = Auth::user();

        return Node::where('created_by', $user->id)->with('creator')
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->get();
    }

    public function getMyNodes(): Collection
    {
        $user = Auth::user();

        return Node::where('created_by', $user->id)->with('creator')->get();
    }

    public function getSystemNodes(): Collection
    {
        // TODO: Implement this to check if the user is an admin
        return Node::all()->load('creator');
    }

    public function getNode($id): ?Node
    {
        return Node::with('users')->findOrFail($id);
    }

    public function createNode(array $data): Node
    {
        $user = User::where('email', $data['created_by'])->firstOrFail();
        $data['created_by'] = $user->id;

        $node = Node::create($data);
        $node->users()->attach($user->id);

        return $node;
    }

    public function addUserToNode(Node $node, string $email): void
    {
        $user = User::where('email', $email)->firstOrFail();
        $node->users()->attach($user);
    }

    public function getNodeCredentials(Node $node): array
    {
        $user = $node->id;
        $password = Str::password(32, true, true, false, false);
        $tags = 'None';
        $rmqhost = env('RABBITMQ_HOST', '127.0.0.1');
        $adminUser = env('RABBITMQ_LOGIN', 'guest');
        $adminPassword = env('RABBITMQ_PASSWORD', 'guest');
        $rmqvhost = env('RABBITMQ_VHOST', '/');

        $url = $rmqhost.':15672/api/users/'.$user;

        $response = Http::withBasicAuth($adminUser, $adminPassword)
            ->put($url, [
                'password' => $password,
                'tags' => $tags,
            ]);

        if ($response->failed()) {
            throw new \Exception('Error creating user');
        }

        $url = $rmqhost.':15672/api/permissions/'.urlencode($rmqvhost).'/'.$user;
        $response = Http::withBasicAuth($adminUser, $adminPassword)
            ->put($url, [
                'configure' => "^{$user}$",
                'write' => '.*',
                'read' => '.*',
            ]);

        if ($response->failed()) {
            throw new \Exception('Error setting permissions');
        }

        return [
            'RABBITMQ_HOST' => env('RABBITMQ_PUBLIC_HOST_IP', '127.0.0.1'),
            'RABBITMQ_PORT' => env('RABBITMQ_PORT', 5672),
            'RABBITMQ_LOGIN' => $user,
            'RABBITMQ_PASSWORD' => $password,
            'RABBITMQ_VHOST' => $rmqvhost,
        ];
    }

    public function getNodeMetrics(Node $node): void
    {
        SendActionToNode::dispatch([
            'pid' => $node->id,
            'node_id' => $node->id,
            'data' => null,
        ], NodeActions::METRICS_HOST->value);
    }
}
