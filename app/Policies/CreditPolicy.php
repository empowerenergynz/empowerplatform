<?php declare(strict_types=1);

namespace App\Policies;

use App\Models\Credit;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CreditPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view all models.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAll(User $user)
    {
        return $user->hasPermissionTo(Credit::PERMISSION_VIEW_ALL_CREDITS);
    }

    /**
     * Determine whether the user can view Credits for their own agency.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAgency(User $user)
    {
        return $user->hasPermissionTo(Credit::PERMISSION_VIEW_AGENCY_CREDITS);
    }

    /**
     * Determine whether the user can view Credits for all agencies, or their own agency.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAllOrAgency(User $user)
    {
        return $this->viewAll($user) || $this->viewAgency($user);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo(Credit::PERMISSION_CREATE_CREDITS);
    }

    /**
     * Determine whether the user can update all the models.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateAll(User $user)
    {
        return $user->hasPermissionTo(Credit::PERMISSION_EDIT_ALL_CREDITS);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Credit $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Credit $model)
    {
//        return $user->hasPermissionTo(Credit::PERMISSION_DELETE_CREDITS);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Credit $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Credit $model)
    {
//        return $user->hasPermissionTo(Credit::PERMISSION_DELETE_CREDITS);
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Credit $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Credit $model)
    {
        //
    }
}
