<?php

declare(strict_types=1);

namespace Tests\Feature\Profile;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\Feature\FeatureTestCase;

class ProfileEditTest extends FeatureTestCase
{
    public function test_it_renders_the_form_to_edit_profile()
    {
        $role = Role::create(['name' => 'foo']);

        $loggedInUser = User::factory()->create();
        $loggedInUser->assignRole($role);

        $this->actingAs($loggedInUser);

        $this->get("/profile")
            ->assertInertia(fn($page) => $page
                ->component('Profile/EditProfile')
                ->has('user', fn($page) => $page
                    ->where('id', $loggedInUser->id)
                    ->where('first_name', $loggedInUser->first_name)
                    ->where('last_name', $loggedInUser->last_name)
                    ->where('email', $loggedInUser->email)
                    ->where('phone_number', $loggedInUser->phone_number)
                    ->where('roles', [[
                            'id' => (string) $role->id,
                            'name' => $role->name,
                            'color' => null,
                            'description' => null,
                        ]]
                    )
                )
                ->has('roles', 6, fn($page) => $page
                    ->has('id')
                    ->has('name')
                    ->has('color')
                    ->has('description')
                )
            );
    }
}
