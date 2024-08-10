<?php

namespace App\Policies;

use App\Models\Node;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NodePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Node $node): bool
    {
        return $this->canAccessNode($user, $node);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Node $node): bool
    {
        return $this->canAccessNode($user, $node);
    }

    public function delete(User $user, Node $node): bool
    {
        return $this->canAccessNode($user, $node);
    }

    protected function canAccessNode(User $user, Node $node): bool
    {
        return $user->id === $node->created_by
            || $node->users()->where('user_id', $user->id)->exists();
    }
}
