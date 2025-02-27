<?php

declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Http\Session\FlashMessage;
use App\Models\User;
use Carbon\Carbon;
use Tests\Feature\FeatureTestCase;

class UsersDestroyTest extends FeatureTestCase
{
    public function test_it_renders_a_403_when_users_do_not_have_permission_to_destroy_users()
    {
        $adminUser = User::factory()->create();
        $this->actingAs($adminUser);

        $user = User::factory()->create();

        $user->delete();

        $this->patch("users/{$user->id}/restore")
            ->assertStatus(403);
    }

    public function test_it_destroys_users()
    {
        $adminUser = User::factory()->create();
        $adminUser->givePermissionTo(User::PERMISSION_DELETE_USERS);
        $this->actingAs($adminUser);

        $user = User::factory()->create();
        Carbon::setTestNow();

        $response = $this->delete("users/{$user->id}");

        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'User archived!',
            "$user->email has been archived",
        )]);
    }
}
