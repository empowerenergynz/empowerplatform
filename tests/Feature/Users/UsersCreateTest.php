<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Models\Agency;
use App\Models\User;
use Tests\Feature\FeatureTestCase;

class UsersCreateTest extends FeatureTestCase
{
    public function test_it_renders_the_form_to_create_a_user()
    {
        $user = User::factory()->create();
        $user->givePermissionTo(User::PERMISSION_CREATE_USERS);
        Agency::factory()->create(['name' => 'C Agency']);
        Agency::factory()->create(['name' => 'A Agency']);

        $this->actingAs($user);

        $this->get('/users/create')
            ->assertInertia(fn($page) => $page
                ->component('Users/CreateUser')
                ->has('agencies', 2)
                // should be sorted
                ->where('agencies.0.name', 'A Agency')
                ->where('agencies.1.name', 'C Agency')
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_users()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $this->get('/users/create')
            ->assertStatus(403);
    }
}
