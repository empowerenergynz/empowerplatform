<?php declare(strict_types=1);

namespace App\ViewModels;

use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;
use Spatie\ViewModels\ViewModel;

class EditUserViewModel extends ViewModel
{
    public function __construct(
        private User $user,
        private Collection $roles,
        private Collection $disabledRoles,
        private ?Role $exclusiveRole,
        private Collection $agencies
    ) {
    }

    public function user()
    {
        return UserResource::make($this->user)->resolve();
    }

    public function roles()
    {
        return RoleResource::collection($this->roles)->resolve();
    }

    public function disabledRoles()
    {
        return RoleResource::collection($this->disabledRoles)->resolve();
    }

    public function exclusiveRole()
    {
        return RoleResource::make($this->exclusiveRole)->resolve();
    }

    public function agencies()
    {
        return $this->agencies->values();
    }
}
