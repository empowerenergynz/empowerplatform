<?php

declare(strict_types=1);

namespace Tests\Feature\SignUp;

use App\Auth\Invitations\InviteUserTokenRepository;
use App\Models\User;
use App\Models\UserInvitation;
use Carbon\Carbon;
use Tests\Feature\FeatureTestCase;

class SignUpCreateTest extends FeatureTestCase
{
    public function test_it_returns_a_404_if_the_token_does_not_exist()
    {
        $this->get(route('sign_up.create', ['token' => 'foo']))
            ->assertStatus(404);
    }

    public function test_it_returns_a_419_if_the_token_is_expired()
    {
        $user = User::factory()->create();
        $userInvitation = UserInvitation::create([
            'created_at' => Carbon::create(2021, 10, 8),
            'token' => 'foo',
            'user_id' => $user->id,
        ]);


        $this->get(route('sign_up.create', ['token' => $userInvitation->token]))
            ->assertStatus(419);
    }

    public function test_it_returns_the_registration_form_if_the_token_is_valid()
    {
        $user = User::factory()->create();
        $token = (new InviteUserTokenRepository())->create($user);

        $this->get(route('sign_up.create', ['token' => $token]))
            ->assertInertia(fn($page) => $page
                ->component('Auth/SignUp'));
    }
}
