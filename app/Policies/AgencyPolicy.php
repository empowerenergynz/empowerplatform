<?php declare(strict_types=1);

namespace App\Policies;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AgencyPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user)
    {
        return $user->hasPermissionTo(Agency::PERMISSION_VIEW_AGENCIES);
    }

    /**
     * Determine whether the user can view the current balance of their own agency
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewOwnBalance(User $user)
    {
        // double-check the user has an agency!  Shouldn't happen if the permission is assigned corrctly...
        return $user->hasPermissionTo(Agency::PERMISSION_VIEW_OWN_AGENCY_BALANCE)
            && $user->agency_id > 0;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo(Agency::PERMISSION_CREATE_AGENCIES);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Agency $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Agency $model)
    {
        return $user->hasPermissionTo(Agency::PERMISSION_EDIT_AGENCIES);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Agency $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Agency $model)
    {
        return $user->hasPermissionTo(Agency::PERMISSION_DELETE_AGENCIES);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Agency $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Agency $model)
    {
        return $user->hasPermissionTo(Agency::PERMISSION_DELETE_AGENCIES);
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\Agency $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Agency $model)
    {
        //
    }
}
