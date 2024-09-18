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
    private string $rmqBaseUrl;

    private string $rmqUsername; //Rabbitmq Management plugin user

    private string $rmqPassword;

    private string $rmqVhost;

    private string $rmqPort; //Rabbitmq PORT

    private string $rmqManagementPort; //Rabbitmq Management port

    public function __construct()
    {
        $this->rmqBaseUrl = env('RABBITMQ_HOST', 'rabbitmq'); //127.0.0.1 or rabbitmq if its a docker network
        $this->rmqUsername = env('RABBITMQ_LOGIN', 'guest');
        $this->rmqPassword = env('RABBITMQ_PASSWORD', 'guest');
        $this->rmqVhost = env('RABBITMQ_VHOST', '/');
        $this->rmqPort = env('RABBITMQ_PORT', 5672);
        $this->rmqManagementPort = env('RABBITMQ_MANAGEMENT_PORT', 15672);
    }

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

    /*
     * This functions creates a rabbitmq user and queue for the node
     * the sends the credentials to the node
     * */

    public function getNodeCredentials(Node $node): array
    {
        // Get Rabbitmq Credentials
        $newNodeRmqUser = $node->id;
        $newNodePassword = Str::password(32, true, true, false, false);
        $tags = 'None';

        $url = $this->rmqBaseUrl.':'.$this->rmqManagementPort.'/api/users/'.$newNodeRmqUser;
        //Create the user for the Node
        $response = Http::withBasicAuth($this->rmqUsername, $this->rmqPassword)
            ->put($url, [
                'password' => $newNodePassword,
                'tags' => $tags,
            ]);

        if ($response->failed()) {
            throw new \Exception('Error creating user');
        }
        //Allow the node to listen the virtual host and to modify the queue with his UUID

        $url = $this->rmqBaseUrl.':15672/api/permissions/'.urlencode($this->rmqVhost).'/'.$newNodeRmqUser;
        $response = Http::withBasicAuth($this->rmqUsername, $this->rmqPassword)
            ->put($url, [
                'configure' => "^{$newNodeRmqUser}$",
                'write' => '.*',
                'read' => '.*',
            ]);

        if ($response->failed()) {
            throw new \Exception('Error setting permissions');
        }

        //Return the node Rabbitmq credentials
        return [
            'RABBITMQ_HOST' => env('RABBITMQ_PUBLIC_HOST_IP', Util::getServerLocalIP()),
            'RABBITMQ_PORT' => $this->rmqPort,
            'RABBITMQ_LOGIN' => $newNodeRmqUser,
            'RABBITMQ_PASSWORD' => $newNodePassword,
            'RABBITMQ_VHOST' => $this->rmqVhost,
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

    public function destroy(Node $node): ?bool
    {
        $this->deleteQueue($node->id);
        $this->deleteUser($node->id);

        return $node->deleteOrFail();

    }

    public function deleteQueue(string $queueName): bool
    {
        $response = Http::withBasicAuth($this->rmqUsername, $this->rmqPassword)
            ->delete("{$this->rmqBaseUrl}/api/queues/".urlencode($this->rmqVhost)."/{$queueName}");

        return $response->successful();
    }

    public function deleteUser(string $username): bool
    {
        $response = Http::withBasicAuth($this->rmqUsername, $this->rmqPassword)
            ->delete("{$this->rmqBaseUrl}/api/users/{$username}");

        return $response->successful();
    }
}
