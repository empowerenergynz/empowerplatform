<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Models\User;
use Inertia\Testing\AssertableInertia;
use Tests\Feature\FeatureTestCase;

class UsersIndexTest extends FeatureTestCase
{
    public function test_it_renders_the_users_screen()
    {
        $user = User::factory()->create();
        $user->givePermissionTo(User::PERMISSION_VIEW_USERS);

        $this->actingAs($user);

        $this->get('/users')
            ->assertInertia(fn($page) => $page
                ->component('Users/Users')
                ->has('usersPaginator', fn(AssertableInertia $page) => $page
                    ->has('total')
                    ->where('per_page', 30)
                    ->has('data', 1)
                    ->etc()
                ))
            ;
    }

    public function test_it_redirects_the_user_when_he_does_not_have_permission_to_view_users()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $this->get('/users')
            ->assertStatus(403);
    }
}
