<?php declare(strict_types=1);

namespace App\ViewModels;

use App\Http\Resources\RoleResource;
use App\Models\User;
use Illuminate\Support\Collection;
use Spatie\ViewModels\ViewModel;

class EditProfileViewModel extends ViewModel
{
    public function __construct(private User $user, private Collection $roles)
    {
    }

    public function user()
    {
        return array_merge(
            $this->user->only('id', 'first_name', 'last_name', 'email', 'phone_number'),
            ['roles' => RoleResource::collection($this->user->roles)->resolve()],
        );
    }

    public function roles()
    {
        return RoleResource::collection($this->roles)->resolve();
    }
}
