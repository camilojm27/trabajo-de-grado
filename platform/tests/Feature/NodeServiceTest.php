<?php

use App\Events\SendActionToNode;
use App\Models\Node;
use App\Models\User;
use App\Services\NodeService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->nodeService = new NodeService;
});

test('getAllUserNodes returns correct nodes', function () {
    $user = User::factory()->create();
    Auth::login($user);

    $ownNode = Node::factory()->create(['created_by' => $user->id]);
    $sharedNode = Node::factory()->create();
    $sharedNode->users()->attach($user);

    $nodes = $this->nodeService->getAllUserNodes();

    expect($nodes->toArray())->toHaveCount(2)
        ->and($nodes->first()->created_by)->toBe($user->id)
        ->and($nodes->last()->created_by)->toBe($user->id)
        ->and($nodes)->toContainOnlyInstancesOf(Node::class);
});

test('getMyNodes returns only user created nodes', function () {
    $user = User::factory()->create();
    Auth::login($user);

    $ownNode = Node::factory()->create(['created_by' => $user->id]);
    $sharedNode = Node::factory()->create();
    $sharedNode->users()->attach($user);

    $nodes = $this->nodeService->getMyNodes();

    expect($nodes)->toHaveCount(2);
    expect($nodes)->toContain($ownNode);
    expect($nodes)->not->toContain($sharedNode);
});

test('createNode creates a new node and attaches user', function () {
    $user = User::factory()->create();
    $data = [
        'name' => 'Test Node',
        'created_by' => $user->email,
    ];

    $node = $this->nodeService->createNode($data);

    expect($node)->toBeInstanceOf(Node::class);
    expect($node->name)->toBe('Test Node');
    expect($node->created_by)->toBe($user->id);
    expect($node->users)->toContain($user);
});

test('addUserToNode attaches user to node', function () {
    $node = Node::factory()->create();
    $user = User::factory()->create();

    $this->nodeService->addUserToNode($node, $user->email);

    expect($node->users)->toContain($user);
});

test('getNodeCredentials returns correct credentials', function () {
    $node = Node::factory()->create();
    Http::fake([
        '*' => Http::response([], 200),
    ]);

    $credentials = $this->nodeService->getNodeCredentials($node);

    expect($credentials)->toHaveKeys(['RABBITMQ_HOST', 'RABBITMQ_PORT', 'RABBITMQ_LOGIN', 'RABBITMQ_PASSWORD', 'RABBITMQ_VHOST']);
});

test('getNodeMetrics dispatches SendActionToNode event', function () {
    $node = Node::factory()->create();

    Event::fake();

    $this->nodeService->getNodeMetrics($node);

    Event::assertDispatched(SendActionToNode::class);
});

it('can delete a queue', function () {
    Http::fake([
        '*' => Http::response(null, 204),
    ]);

    $result = $this->nodeService->deleteQueue('test-queue');

    expect($result)->toBeTrue();

    Http::assertSent(function ($request) {
        return $request->url() == config('rabbitmq.management_api_url').'/api/queues/%2F/test-queue' &&
            $request->method() == 'DELETE';
    });
});

it('can delete a user', function () {
    Http::fake([
        '*' => Http::response(null, 204),
    ]);

    $result = $this->nodeService->deleteUser('test-user');

    expect($result)->toBeTrue();

    Http::assertSent(function ($request) {
        return $request->url() == config('rabbitmq.management_api_url').'/api/users/test-user' &&
            $request->method() == 'DELETE';
    });
});

it('handles queue deletion failure', function () {
    Http::fake([
        '*' => Http::response(null, 404),
    ]);

    $result = $this->nodeService->deleteQueue('non-existent-queue');

    expect($result)->toBeFalse();
});

it('handles user deletion failure', function () {
    Http::fake([
        '*' => Http::response(null, 404),
    ]);

    $result = $this->nodeService->deleteUser('non-existent-user');

    expect($result)->toBeFalse();
});
