<?php declare(strict_types=1);

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class UserWithRoleDonorRule implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        /** @var User $user */
        $user = User::where('id', $value)->first();
        if ($user === null) {
            return false;
        }

        return $user->hasRole(User::ROLE_DONOR);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'This user is not a donor.';
    }
}
