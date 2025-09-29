<?php

namespace App\Policies;

use App\Models\Mesocycle;
use App\Models\User;

class MesocyclePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Mesocycle $mesocycle): bool
    {
        return $user->id === $mesocycle->user_id;
    }

    public function update(User $user, Mesocycle $mesocycle): bool
    {
        return $user->id === $mesocycle->user_id;
    }

    public function delete(User $user, Mesocycle $mesocycle): bool
    {
        return $user->id === $mesocycle->user_id;
    }

    public function duplicate(User $user, Mesocycle $mesocycle): bool
    {
        return $user->id === $mesocycle->user_id;
    }
}
