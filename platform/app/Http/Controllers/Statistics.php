<?php

namespace App\Http\Controllers;

use App\Models\Container;
use App\Models\Node;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class Statistics extends Controller
{
    public function dashboard(): \Inertia\Response
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();

        // Nodos añadidos esta semana (total y cada día)
        $nodesAddedThisWeek = Node::where('created_at', '>=', $startOfWeek)->get();
        $nodesAddedEachDayThisWeek = Node::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $startOfWeek)
            ->groupBy('date')
            ->get();
        // Nodos creados hoy
        $nodesCreatedToday = Node::whereDate('created_at', $today)->get();

        // Nodos creados por el usuario logueado
        $userId = Auth::id();
        $nodesCreatedByUser = Node::where('created_by', $userId)->get();

        $nodesInTotal = Node::all()->count();

        // Nodos en línea (asumiendo que tienes un atributo que define esto)
        // Aquí se asume que tienes un campo 'status' que indica si el nodo está en línea
        $nodesOnline = Node::select(['id'])->get();

        $onlineCount = $nodesOnline->filter(fn ($node) => $node->isOnline())->count();
        $offlineCount = $nodesOnline->filter(fn ($node) => ! $node->isOnline())->count();

        $containerStateCount = Container::select('state')
            ->selectRaw('count(*) as count')
            ->groupBy('state')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->state => $item->count];
            });

        // Pasa estos datos a la vista
        return Inertia::render('Dashboard', [
            'nodesAddedThisWeek' => $nodesAddedThisWeek,
            'nodesAddedEachDayThisWeek' => $nodesAddedEachDayThisWeek,
            'nodesCreatedToday' => $nodesCreatedToday,
            'nodesCreatedByUser' => $nodesCreatedByUser,
            'nodesInTotal' => $nodesInTotal,
            'nodesOnline' => $nodesOnline,
            'containerStateCount' => $containerStateCount,
            'nodesOnlineCount' => $onlineCount,
            'nodesOfflineCount' => $offlineCount,
        ]);
    }
}
