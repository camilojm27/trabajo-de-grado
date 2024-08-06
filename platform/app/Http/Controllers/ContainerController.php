<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContainerRequest;
use App\Models\Container;
use App\Models\Node;
use App\Services\ContainerService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContainerController extends Controller
{
    private $containerService;

    public function __construct(ContainerService $containerService)
    {
        $this->containerService = $containerService;
    }

    protected function authorize(string $ability, Container $container): void
    {
        if (! auth()->user()->can($ability, $container)) {
            throw new AuthorizationException('This action is unauthorized.');
        }
    }

    public function index(): Response
    {
        $containers = $this->containerService->getUserContainers(auth()->user());

        return Inertia::render('Container/Containers', [
            'containers' => $containers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Container/Create', [
            'nodes' => Node::all(), //TODO: Get User Nodes
        ]);
    }

    public function store(StoreContainerRequest $request): Response
    {
        $container = $this->containerService->createContainer($request->validated());

        return Inertia::render('Container/Create', [
            'success' => 'Container created successfully!',
            'container_id' => $container->id,
        ]);
    }

    public function logs(Container $container): JsonResponse
    {
        $this->authorize('view', $container);
        $logs = $this->containerService->getLogs($container);

        return response()->json(['logs' => $logs]);
    }

    public function recreate(Container $container): JsonResponse
    {
        $this->authorize('update', $container);
        $this->containerService->recreateContainer($container);

        return response()->json(['message' => 'Container recreation initiated']);
    }

    public function restart(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->restartContainer($container);

        return redirect()->back()->with('success', 'Container restart initiated');
    }

    public function start(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->startContainer($container);

        return redirect()->back()->with('success', 'Container start initiated');
    }

    public function stop(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->stopContainer($container);

        return redirect()->back()->with('success', 'Container stop initiated');
    }

    public function kill(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->killContainer($container);

        return redirect()->back()->with('success', 'Container kill initiated');
    }

    public function pause(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->pauseContainer($container);

        return redirect()->back()->with('success', 'Container pause initiated');
    }

    public function unpause(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->unpauseContainer($container);

        return redirect()->back()->with('success', 'Container unpause initiated');
    }

    public function show(Container $container): Response
    {
        $this->authorize('view', $container);

        return Inertia::render('Container/Show', [
            'container' => $container->load('node'),
        ]);
    }

    public function showNode(Node $node): Response
    {
        $containers = $node->containers;

        return Inertia::render('Container/Containers', [
            'containers' => $containers,
        ]);
    }

    public function destroy(Container $container): RedirectResponse
    {
        $this->authorize('delete', $container);
        $this->containerService->deleteContainer($container);

        return redirect()->back()->with('success', 'Container deletion initiated');
    }

    public function metrics(Container $container): JsonResponse
    {
        $this->authorize('view', $container);
        $metrics = $this->containerService->getMetrics($container);

        return response()->json(['metrics' => $metrics]);
    }
}
