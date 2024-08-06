<?php

namespace App\Policies;

use App\Models\Container;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContainerPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Container $container): bool
    {
        return $this->canAccessContainer($user, $container);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Container $container): bool
    {
        return $this->canAccessContainer($user, $container);
    }

    public function delete(User $user, Container $container): bool
    {
        return $this->canAccessContainer($user, $container);
    }

    protected function canAccessContainer(User $user, Container $container): bool
    {
        return $user->id === $container->node->created_by
            || $container->node->users()->where('user_id', $user->id)->exists();
    }
}
