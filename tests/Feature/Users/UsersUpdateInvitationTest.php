<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Auth\Notifications\InviteUser;
use App\Http\Session\FlashMessage;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Facades\Notification;
use Tests\Feature\FeatureTestCase;

class UsersUpdateInvitationTest extends FeatureTestCase
{
    public function test_it_renders_a_403_when_users_do_not_have_permission_to_resend_invitations()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $invitedDonor = User::factory()->create();
        $this->put("/users/invitations/$invitedDonor->id")
            ->assertStatus(403);
    }

    public function test_it_resends_invitations()
    {
        Notification::fake();

        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_CREATE_USERS);
        $this->actingAs($admin);

        $user = User::factory()->create();
        UserInvitation::create([
            'user_id' => $user->id,
            'token' => 'test_token',
        ]);

        $this->assertDatabaseHas('user_invitations', [
            'user_id' => $user->id,
        ]);

        $response = $this->put("/users/invitations/$user->id");

        $this->assertDatabaseHas('user_invitations', [
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseCount('user_invitations', 1);

        Notification::assertSentTo(
            [$user],
            InviteUser::class,
        );

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Invitation sent!',
            "Invitation resent to $user->email",
        )]);
    }
}
