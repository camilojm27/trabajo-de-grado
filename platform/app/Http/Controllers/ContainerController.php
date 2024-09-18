<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContainerRequest;
use App\Models\Container;
use App\Models\Node;
use App\Models\TempHash;
use App\Services\ContainerService;
use App\Services\ContainerTemplateService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContainerController extends Controller
{
    private $containerService;

    private $containerTemplateService;

    public function __construct(ContainerService $containerService, ContainerTemplateService $containerTemplateService)
    {
        $this->containerService = $containerService;
        $this->containerTemplateService = $containerTemplateService;
    }

    protected function authorize(string $ability, Container $container): void
    {
        if (! auth()->user()->can($ability, $container)) {
            throw new AuthorizationException('This action is unauthorized.');
        }
    }

    public function index(): Response
    {
        $query = request()->query();
        if (! array_key_exists('tab', $query)) {
            $containers = $this->containerService->getUserContainers(auth()->user());
        } else {
            switch ($query['tab']) {
                case 'system-containers':
                    $containers = $this->containerService->getAllContainers();
                    break;
                case 'my-containers':
                    $containers = $this->containerService->getMyContainers(auth()->user());
                    break;
                case 'all-containers':
                    $containers = $this->containerService->getUserContainers(auth()->user());

                    break;
            }

        }

        return Inertia::render('Container/Containers', [
            'containers' => $containers,
            'queryParams' => request()->query(),
        ]);
    }

    public function create(): Response
    {
        $templates = $this->containerTemplateService->getAllTemplates();

        return Inertia::render('Container/Create', [
            'nodes' => Node::all(), //TODO: Get User Nodes
            'templates' => $templates,
        ]);
    }

    public function store(StoreContainerRequest $request): Response
    {
        $container = $this->containerService->createContainer($request->validated());

        //        if ($request->input('save_as_template')) {
        //            $this->containerTemplateService->createTemplate($request->input('template_name'), $container->attributesToArray());
        //        }

        $templates = $this->containerTemplateService->getAllTemplates();

        return Inertia::render('Container/Create', [
            'success' => 'Container created successfully!',
            'container_id' => $container->id,
            'nodes' => Node::all(), //TODO: Get User Nodes
            'templates' => $templates,
        ]);
    }

    public function logs(Container $container): JsonResponse
    {
        $this->authorize('view', $container);
        $logs = $this->containerService->getLogs($container);

        return response()->json(['logs' => $logs]);
    }

    public function requestLogFile(Container $container)
    {
        $this->authorize('view', $container);
        $this->containerService->requestLogFile($container);

        return redirect()->back()->with('success', 'Container log file requested.');
    }

    /**
     * @throws FileNotFoundException
     */
    public function uploadLogFile(Request $request, $hash)
    {
        $tempHash = TempHash::where('hash', $hash)
            ->where('expires_at', '>', now())
            ->first();

        $request->validate([
            'log_file' => 'required|file',
        ]);

        $container = $tempHash->container;

        $path = Storage::disk('public')->putFileAs('containerlog', $request->log_file, $container->id.'.txt');

        $downloadLink = Storage::url($path);
        //        if (Storage::disk('public')->exists($container->log_file_path)) {
        //            Storage::disk('public')->delete($container->log_file_path);
        //        }
        $container->update([
            'log_file_path' => $path,
            'log_download_link' => $downloadLink,
            'log_timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Log file uploaded successfully',
            'download_link' => $downloadLink,
        ]);
    }

    public function recreate(Container $container): RedirectResponse
    {
        $this->authorize('update', $container);
        $this->containerService->recreateContainer($container);

        return redirect()->back()->with('success', 'Container recreate initiated');
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
