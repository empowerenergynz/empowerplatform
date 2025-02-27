<?php

declare(strict_types=1);
namespace Tests\Feature\Users;

use App\Http\Session\FlashMessage;
use App\Models\User;
use Carbon\Carbon;
use Tests\Feature\FeatureTestCase;


class UsersRestoreTest extends FeatureTestCase
{
    public function test_it_renders_a_403_when_user_do_not_have_permission_to_restore_users()
    {
        $adminUser = User::factory()->create();
        $this->actingAs($adminUser);

        $user = User::factory()->create();

       $user->delete();

        $this->patch("users/{$user->id}/restore")
            ->assertStatus(403);
    }

    public function test_it_restores_user()
    {
        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_DELETE_USERS);
        $this->actingAs($admin);

        $user = User::factory()->create();
        $user->delete();

        Carbon::setTestNow();

        $response = $this->patch("users/{$user->id}/restore");

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'deleted_at' => null,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'User restored!',
            "$user->email has been restored",
        )]);
    }
}
