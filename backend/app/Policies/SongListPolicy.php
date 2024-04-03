<?php

namespace App\Policies;

use App\Models\SongList;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SongListPolicy
{
    use HandlesAuthorization;
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SongList $songlist)
    {
        return $user->id == $songlist->user_id;
    }

    public function create(User $user)
    {
        return $user->id > 0;
    }

    public function update(User $user, SongList $songlist)
    {
        return $user->id == $songlist->user_id;
    }

    public function delete(User $user, SongList $songlist)
    {
        return $user->id == $songlist->user_id;
    }
}
