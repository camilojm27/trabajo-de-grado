<?php

namespace App\Services;

use App\Enums\ContainerActions;
use App\Events\SendActionToNode;
use App\Models\Container;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ContainerService
{
    public function getUserContainers(User $user)
    {
        return Container::with('node')
            ->whereHas('node', function ($query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhereHas('users', function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    });
            })
            ->get();
    }

    public function createContainer(array $data): Container
    {
        $container = Container::create([
            'name' => $data['name'],
            'image' => $data['image'],
            'node_id' => $data['node'],
            'attributes' => $data['attributes'],
            'state' => 'send',
            'verified' => false,
        ]);

        $this->dispatchContainerAction($container, ContainerActions::CREATE);

        return $container;
    }

    public function getLogs(Container $container): string
    {
        $cachedLogs = Cache::get("container-logs-{$container->container_id}");

        if ($cachedLogs) {
            return $cachedLogs;
        }

        $this->dispatchContainerAction($container, ContainerActions::LOGS);

        return 'Logs requested. Please check back later.';
    }

    public function recreateContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::CREATE);
        $this->updateContainerState($container, 'send', false);
    }

    public function restartContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::RESTART);
        $this->updateContainerState($container, 'send', false);
    }

    public function startContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::START);
        $this->updateContainerState($container, 'send', false);
    }

    public function stopContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::STOP);
        $this->updateContainerState($container, 'send', false);
    }

    public function killContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::KILL);
        $this->updateContainerState($container, 'send', false);
    }

    public function pauseContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::PAUSE);
        $this->updateContainerState($container, 'send', false);
    }

    public function unpauseContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::UNPAUSE);
        $this->updateContainerState($container, 'send', false);
    }

    public function deleteContainer(Container $container): void
    {
        $this->dispatchContainerAction($container, ContainerActions::DELETE);
        $this->updateContainerState($container, 'send', false);
    }

    public function getMetrics(Container $container): array
    {
        $this->dispatchContainerAction($container, ContainerActions::METRICS);

        // Placeholder for actual metrics retrieval
        return ['message' => 'Metrics requested. Please check back later.'];
    }

    private function dispatchContainerAction(Container $container, ContainerActions $action): void
    {
        try {
            SendActionToNode::dispatch([
                'node_id' => $container->node_id,
                'pid' => $container->id,
                'data' => $container->attributesToArray(),
            ], $action->value);
        } catch (\Exception $e) {
            Log::error("Failed to dispatch container action: {$e->getMessage()}");
            throw new \Exception("Failed to perform {$action->value} operation on container.");
        }
    }

    private function updateContainerState(Container $container, string $state, bool $verified): void
    {
        $container->state = $state;
        $container->verified = $verified;
        $container->save();
    }
}
