<?php

declare(strict_types=1);

namespace Tests\Feature\Profile;

use App\Http\Session\FlashMessage;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\Feature\FeatureTestCase;

class ProfileUpdateTest extends FeatureTestCase
{
    public function test_it_updates_profile()
    {
        $roleA = Role::create(['name' => 'foo']);

        $user = User::factory()->create();
        $user->assignRole($roleA);

        $this->actingAs($user);

        $response = $this->put("/profile", [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
        ]);

        $updatedUser = User::where('email', 'updated_email@empower.local')->first();

        $this->assertTrue($updatedUser->hasExactRoles([$roleA]));

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Profile updated!',
           'Your profile has been updated',
        )]);
    }
}
