<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Models\Agency;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\Feature\FeatureTestCase;

class UsersEditTest extends FeatureTestCase
{
    public function test_it_renders_the_form_to_edit_users()
    {
        $loggedUser = User::factory()->create();
        $loggedUser->givePermissionTo(User::PERMISSION_EDIT_USERS);

        $this->actingAs($loggedUser);

        $role = Role::create(['name' => 'foo']);
        $user = User::factory()->create([
            'last_login_at' => now(),
        ]);

        $user->assignRole($role);
        Agency::factory()->create(['name' => 'C Agency']);
        Agency::factory()->create(['name' => 'A Agency']);

        $this->get("/users/{$user->id}/edit")
            ->assertInertia(fn($page) => $page
                ->component('Users/CreateUser')
                ->has('user', fn($page) => $page
                    ->where('id', $user->id)
                    ->where('name', $user->name)
                    ->where('first_name', $user->first_name)
                    ->where('last_name', $user->last_name)
                    ->where('email', $user->email)
                    ->where('reference', $user->reference)
                    ->where('phone_number', $user->phone_number)
                    ->where('roles', [[
                        'id' => (string) $role->id,
                        'name' => $role->name,
                        'color' => null,
                        'description' => null,
                        ]]
                    )
                    ->where('last_login_at', $user->last_login_at->toISOString())
                    ->where('invited_at', $user->invited_at)
                    ->where('deleted_at', $user->deleted_at)
                    ->where('agency_id', null)
                )
                ->has('agencies', 2)
                // should be sorted
                ->where('agencies.0.name', 'A Agency')
                ->where('agencies.1.name', 'C Agency')
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_edit_users()
    {
        $loggedUser = User::factory()->create();

        $this->actingAs($loggedUser);

        $user = User::factory()->create();

        $this->get("/users/{$user->id}/edit")
            ->assertStatus(403);
    }
}
