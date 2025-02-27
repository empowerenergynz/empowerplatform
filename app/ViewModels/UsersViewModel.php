<?php declare(strict_types=1);

namespace App\ViewModels;

use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use Illuminate\Database\Eloquent\Collection;
use Spatie\ViewModels\ViewModel;

class UsersViewModel extends ViewModel
{
    public function __construct(private Collection $users, private Collection $roles, private array|null $filter)
    {
    }

    public function users()
    {
        return UserResource::collection($this->users)->resolve();
    }

    public function roles()
    {
        return RoleResource::collection($this->roles)->resolve();
    }

    public function filter()
    {
        return $this->filter;
    }
}
