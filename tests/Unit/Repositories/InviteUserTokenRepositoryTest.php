<?php

declare(strict_types=1);

namespace Tests\Unit\Repositories;

use App\Models\User;
use App\Models\UserInvitation;
use App\Auth\Invitations\InviteUserTokenRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InviteUserTokenRepositoryTest extends \Tests\TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_token()
    {
        $user = User::factory()->create();
        $repository = new InviteUserTokenRepository();
        $token = $repository->create($user);

        $this->assertDatabaseHas('user_invitations', [
            'user_id' => $user->id,
            'token' => $token,
        ]);
    }

    public function test_it_deletes_existing_token_for_the_user_and_create_a_new_one()
    {
        $user = User::factory()->create();

        UserInvitation::create([
            'user_id' => $user->id,
            'token' => 'FOO',
        ]);

        $this->assertDatabaseCount('user_invitations', 1);

        $repository = new InviteUserTokenRepository();
        $token = $repository->create($user);

        $this->assertDatabaseCount('user_invitations', 1);
        $this->assertDatabaseHas('user_invitations', [
            'user_id' => $user->id,
            'token' => $token,
        ]);
    }
}
