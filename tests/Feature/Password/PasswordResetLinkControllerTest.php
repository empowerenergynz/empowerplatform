<?php

declare(strict_types=1);

namespace Tests\Feature\Password;

use App\Http\Session\FlashMessage;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Tests\Feature\FeatureTestCase;

class PasswordResetLinkControllerTest extends FeatureTestCase
{
    public function test_it_renders_the_password_reset_form_screen()
    {
        $this->get('/forgot-password')
            ->assertInertia(fn($page) => $page
                ->component('Auth/ForgotPassword'));
    }

    public function test_it_stores_password_reset_and_sent_an_email_to_users()
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->post('/forgot-password', ['email' => $user->email]);

        $this->assertDatabaseHas('password_resets', [
            'email' => $user->email,
        ]);

        Notification::assertSentTo(
            [$user],
            ResetPassword::class,
        );

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Password reset',
            'If an account is associated with this email a reset password link will be sent',
        )]);
    }

    public function test_it_does_not_throw_an_error_when_user_does_not_exist()
    {
        $response = $this->post('/forgot-password', ['email' => 'foo@empower.local']);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Password reset',
            'If an account is associated with this email a reset password link will be sent',
        )]);
    }
}
