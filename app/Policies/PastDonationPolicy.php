<?php declare(strict_types=1);

namespace App\Policies;

use App\Models\PastDonation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PastDonationPolicy
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
        return $user->hasPermissionTo(PastDonation::PERMISSION_VIEW_PAST_DONATIONS);
    }

    /**
     * Determine whether the user can view their own models.
     *
     * @param User $user
     * @return bool
     */
    public function viewOwn(User $user): bool
    {
        return $user->hasPermissionTo(PastDonation::PERMISSION_VIEW_OWN_PAST_DONATIONS);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param PastDonation $pastDonation
     * @return bool
     */
    public function view(User $user, PastDonation $pastDonation): bool
    {
        return $user->hasPermissionTo(PastDonation::PERMISSION_VIEW_PAST_DONATIONS)
            // a Donor can only view their own PastDonation
            && ($user->hasPermissionTo(User::PERMISSION_VIEW_USERS) || $pastDonation->user->id == $user->id);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return bool
     */
    public function createAny(User $user): bool
    {
        return $user->hasPermissionTo(PastDonation::PERMISSION_CREATE_PAST_DONATIONS);
    }
}
