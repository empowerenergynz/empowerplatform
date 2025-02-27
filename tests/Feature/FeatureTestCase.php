<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeatureTestCase extends TestCase
{
    use RefreshDatabase;

    public function logInAsDonor(User $user = null): User
    {
        if (!$user) {
            $user = User::factory()->create();
            $user->assignRole(User::ROLE_DONOR);
        }

        $this->actingAs($user);
        return $user;
    }

    public function logInAsAdmin(User $user = null): User
    {
        if (!$user) {
            $user = User::factory()->create();
            $user->assignRole(User::ROLE_ADMIN);
        }

        $this->actingAs($user);
        return $user;
    }

    public function logInAsSuperAdmin(User $user = null): User
    {
        if (!$user) {
            $user = User::factory()->create();
            $user->assignRole(User::ROLE_SUPER_ADMIN);
        }

        $this->actingAs($user);
        return $user;
    }

    public function logInAsAgencyUser(Agency $agency = null, User $user = null): User
    {
        if (!$agency) {
            $agency = Agency::factory()->create();
        }
        if (!$user) {
            $user = User::factory()->create([
                'agency_id' => $agency->id,
            ]);
            $user->assignRole(User::ROLE_AGENCY_USER);
        }

        $this->actingAs($user);
        return $user;
    }

    public function logInAsAgencyAdmin(Agency $agency = null, User $user = null): User
    {
        if (!$agency) {
            $agency = Agency::factory()->create();
        }
        if (!$user) {
            $user = User::factory()->create([
                'agency_id' => $agency->id,
            ]);
            $user->assignRole(User::ROLE_AGENCY_ADMIN);
        }

        $this->actingAs($user);
        return $user;
    }

    public function logInAsNoRole(User $user = null): User
    {
        if (!$user) {
            $user = User::factory()->create();
        }

        $this->actingAs($user);
        return $user;
    }
}
