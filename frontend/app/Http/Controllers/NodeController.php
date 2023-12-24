<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNodeRequest;
use App\Models\Node;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNodeRequest $request): JsonResponse
    {
        $validated = $request->safe(['name', 'hostname', 'ip_address']);
        $node = new Node();
        $node->fill($validated);
        $node->save();
        return response()->json(['id' => $node->id], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Node $node)
    {
        //
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
