<?php

declare(strict_types=1);

namespace Tests\Feature\Password;

use App\Http\Session\FlashMessage;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Tests\Feature\FeatureTestCase;

class NewPasswordControllerTest extends FeatureTestCase
{
    public function test_it_renders_the_new_password_form_screen()
    {
        $user = User::factory()->create();

        $token = Password::createToken($user);

        $this->get(route('password.reset', ['token' => $token, 'email' => $user->email,]))
            ->assertInertia(fn($page) => $page
                ->component('Auth/ResetPassword')
                ->where('token', $token)
            );
    }

    public function test_it_renders_a_404_if_the_email_address_does_not_exist_in_the_db()
    {
        $this->get(route('password.reset', ['token' => 'foo', 'email' => 'foo@empower.local',]))
            ->assertStatus(404);
    }

    public function test_it_renders_a_419_if_the_token_is_invalid()
    {
        $user = User::factory()->create();

        $this->get(route('password.reset', ['token' => 'foo', 'email' => $user->email,]))
            ->assertStatus(419);
    }

    public function test_it_resets_users_passwords()
    {
        $user = User::factory()->create();

        $token = Password::createToken($user);

        $response = $this->post(route('password.update'), [
            'token' => $token,
            'email' => $user->email,
            'password' => 'my_secure_password',
            'password_confirmation' => 'my_secure_password',
        ]);

        $this->assertDatabaseMissing('password_resets', [
            'token' => $token,
            'email' => $user->email,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Password reset',
            'Your password has been updated',
        )]);

        $response->assertRedirect(route('login'));
    }

    public function test_it_returns_a_flash_error_message_for_an_invalid_token()
    {
        $user = User::factory()->create();

        $response = $this->post(route('password.update'), [
            'token' => 'fooo',
            'email' => $user->email,
            'password' => 'my_secure_password',
            'password_confirmation' => 'my_secure_password',
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'error',
            'Error',
            'An error occurred while resetting your password',
        )]);
    }
}
