<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNodeRequest;
use App\Models\Node;
use App\Models\User;
use App\Services\NodeService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class NodeController extends Controller
{
    private $nodeService;

    public function __construct(NodeService $nodeService)
    {
        $this->nodeService = $nodeService;
    }

    protected function authorize(string $ability, Node $node): void
    {
        if (! auth()->user()->can($ability, $node)) {
            throw new \Illuminate\Auth\Access\AuthorizationException('This action is unauthorized.');
        }
    }

    public function index(Request $request, $id = null): Response
    {
        $selectedNode = $id ? $this->nodeService->getNode($id) : null;

        return Inertia::render('Nodes/Nodes', [
            'auth' => [
                'user' => $request->user(),
            ],
            'systemNodes' => $this->nodeService->getSystemNodes(),
            'allUserNodes' => $this->nodeService->getAllUserNodes(),
            'myNodes' => $this->nodeService->getMyNodes(),
            'selectedNode' => $selectedNode,
            'params' => [
                'id' => $id,
            ],
        ]);
    }

    public function addUserToNode(Request $request, Node $node): RedirectResponse
    {
        $this->authorize('update', $node);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email|not_in:'.$node->users->pluck('email')->implode(','),
        ]);

        $this->nodeService->addUserToNode($node, $validated['email']);

        return Redirect::back()->with('success', 'User added successfully');
    }

    public function deleteUserFromNode(Node $node, $userId): RedirectResponse
    {
        $this->authorize('delete', $node);

        $user = User::findOrFail($userId);

        if ($node->created_by === $user->id) { // Assuming there's a creator_id field
            return Redirect()->back()->withErrors('error', 'The owner of the node cannot be deleted.');
        }

        if (! $node->users()->where('user_id', $user->id)->exists()) {
            return Redirect()->back()->withErrors('error', 'User not found on this node.');
        }

        $node->users()->detach($user->id);

        return Redirect::back()->with('success', 'User removed successfully.');

    }

    public function store(StoreNodeRequest $request): JsonResponse
    {
        $node = $this->nodeService->createNode($request->validated());

        return response()->json(['id' => $node->id], HttpResponse::HTTP_CREATED);
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

    /**
     * @throws Exception
     */
    public function showCredentials(Node $node): JsonResponse
    {
        // $this->authorize('view', $node);

        $credentials = $this->nodeService->getNodeCredentials($node);

        return response()->json($credentials, HttpResponse::HTTP_OK);
    }

    public function metrics(Node $node): JsonResponse
    {
        $this->nodeService->getNodeMetrics($node);

        return response()->json([], HttpResponse::HTTP_OK);
    }

    public function destroy() {}
}
