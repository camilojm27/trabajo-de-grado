<?php
namespace App\Http\Controllers;

use App\Models\Container;
use App\Models\Node;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class Statistics extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();

        // Get all nodes
        $nodes = Node::with('creator')->get();

        // Get all containers with their nodes
        $containers = Container::with('node')->get();

        // Get all users
        $users = User::all();

        // Nodes added this week (total and each day)
        $nodesAddedThisWeek = $nodes->where('created_at', '>=', $startOfWeek);
        $nodesAddedEachDayThisWeek = Node::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $startOfWeek)
            ->groupBy('date')
            ->get();

        // Nodes created today
        $nodesCreatedToday = $nodes->where('created_at', '>=', $today);

        // Nodes created by the logged-in user
        $userId = Auth::id();
        $nodesCreatedByUser = $nodes->where('created_by', $userId);

        $nodesInTotal = $nodes->count();

        // Count online/offline nodes
        $nodesOnlineCount = $nodes->filter(fn ($node) => $node->isOnline())->count();
        $nodesOfflineCount = $nodes->filter(fn ($node) => !$node->isOnline())->count();

        // Get container states count
        $containerStateCount = Container::select('state')
            ->selectRaw('count(*) as count')
            ->groupBy('state')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->state => $item->count];
            });

        return Inertia::render('Dashboard', [
            'nodesAddedThisWeek' => $nodesAddedThisWeek,
            'nodesAddedEachDayThisWeek' => $nodesAddedEachDayThisWeek,
            'nodesCreatedToday' => $nodesCreatedToday,
            'nodesCreatedByUser' => $nodesCreatedByUser,
            'nodesInTotal' => $nodesInTotal,
            'nodesOnlineCount' => $nodesOnlineCount,
            'nodesOfflineCount' => $nodesOfflineCount,
            'containerStateCount' => $containerStateCount,
            // Add new data for the dashboard charts
            'dashboardData' => [
                'nodes' => $nodes,
                'containers' => $containers,
                'users' => $users,
                'systemMetrics' => [
                    'cpu_usage' => $this->getSystemCPUUsage(),
                    'mem_usage' => $this->getSystemMemoryUsage(),
                ],
            ],
        ]);
    }

    private function getSystemCPUUsage()
    {
        // Read CPU usage from /proc/stat
        $stat1 = file('/proc/stat');
        usleep(100000); // Sleep for 100ms
        $stat2 = file('/proc/stat');

        // Parse the first line of /proc/stat
        $cpu1 = explode(' ', preg_replace('/\s+/', ' ', $stat1[0]));
        $cpu2 = explode(' ', preg_replace('/\s+/', ' ', $stat2[0]));

        // Calculate CPU usage
        $total1 = $cpu1[1] + $cpu1[2] + $cpu1[3] + $cpu1[4] + $cpu1[5] + $cpu1[6] + $cpu1[7];
        $total2 = $cpu2[1] + $cpu2[2] + $cpu2[3] + $cpu2[4] + $cpu2[5] + $cpu2[6] + $cpu2[7];
        $idle1 = $cpu1[4];
        $idle2 = $cpu2[4];

        $total_diff = $total2 - $total1;
        $idle_diff = $idle2 - $idle1;

        $cpu_usage = (1 - ($idle_diff / $total_diff)) * 100;
        return $cpu_usage;
    }

    private function getSystemMemoryUsage()
    {
        // Read memory info from /proc/meminfo
        $meminfo = file_get_contents('/proc/meminfo');
        preg_match_all('/^(.+?):\s+(\d+)/m', $meminfo, $matches);
        $meminfo = array_combine($matches[1], $matches[2]);

        $total = $meminfo['MemTotal'];
        $available = $meminfo['MemAvailable'];
        $used = $total - $available;

        return ($used / $total) * 100;
    }
}
