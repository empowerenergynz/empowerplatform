<?php

declare(strict_types=1);

namespace Tests\Feature\SignUp;

use App\Auth\Invitations\InviteUserTokenRepository;
use App\Models\User;
use Tests\Feature\FeatureTestCase;

class SignUpStoreTest extends FeatureTestCase
{
    public function test_it_sets_up_user_account()
    {
        $user = User::factory()->create();
        $token = (new InviteUserTokenRepository())->create($user);

        $this->followingRedirects();

        $this->post(route('sign_up.store', [
            'token' => $token,
            'email' => $user->email,
            'phone_number' => '+64033719454',
            'password' => 'my_secure_password',
            'password_confirmation' => 'my_secure_password',
        ]));

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => '+64033719454',
            'email' => $user->email,
        ]);

        $this->assertDatabaseCount('user_invitations', 0);

        $this->assertAuthenticatedAs($user);
    }
}
