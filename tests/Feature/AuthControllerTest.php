<?php declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Carbon\Carbon;

class AuthControllerTest extends FeatureTestCase
{
    public function test_it_renders_the_login_form_screen()
    {
        $this->get('/login')
            ->assertInertia(fn($page) => $page
                ->component('Auth/Login'));
    }

    public function test_successful_login_redirects_user_to_jobs_screen()
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/');
    }

    public function test_failed_login_returns_error_message_with_email_key()
    {
        $this->from('/login')
            ->post('/login', ['email' => 'foo@bar.com', 'password' => 'password'])
            ->assertRedirect('/login')
            ->assertSessionHasErrors(['email']);
    }

    public function test_successful_logout_redirects_user_to_login_screen()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $this->post('/logout')
            ->assertRedirect('/login');
    }

    public function test_it_records_user_last_login_timestamp()
    {
        $user = User::factory()->create();
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);

        Carbon::setTestNow();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'last_login_at' => Carbon::now(),
        ]);
    }
}
