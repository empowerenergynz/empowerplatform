<?php declare(strict_types=1);

namespace App\Policies;

use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DonationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Donation::PERMISSION_VIEW_DONATIONS);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Donation $donation
     * @return bool
     */
    public function view(User $user, Donation $donation): bool
    {
        return $user->hasPermissionTo(Donation::PERMISSION_VIEW_DONATIONS)
            // a Donor can only view their own Donation
            && ($user->hasPermissionTo(User::PERMISSION_VIEW_USERS) || $donation->user_id == $user->id);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return bool
     */
    public function createAny(User $user): bool
    {
        return $user->hasPermissionTo(Donation::PERMISSION_CREATE_DONATIONS);
    }

    /**
     * Determine whether the user can create the model.
     *
     * @param User $user
     * @param StoreDonationRequest $donation
     * @return bool
     */
    public function create(User $user, StoreDonationRequest $donation): bool
    {
        return $user->hasPermissionTo(Donation::PERMISSION_CREATE_DONATIONS)
            // a Donor can only create their own Donations
            && ($user->hasPermissionTo(User::PERMISSION_VIEW_USERS) || $donation->user_id == $user->id);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Donation $donation
     * @return bool
     */
    public function update(User $user, Donation $donation): bool
    {
        return $user->hasPermissionTo(Donation::PERMISSION_EDIT_DONATIONS)
            // a Donor can only create/update their own Donations
            && ($user->hasPermissionTo(User::PERMISSION_VIEW_USERS) || $donation->user_id == $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Donation $donation
     * @return bool
     */
    public function delete(User $user, Donation $donation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param User $user
     * @param Donation $donation
     * @return bool
     */
    public function restore(User $user, Donation $donation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param User $user
     * @param Donation $donation
     * @return bool
     */
    public function forceDelete(User $user, Donation $donation): bool
    {
        return false;
    }
}
