<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Http\Session\FlashMessage;
use App\Models\Agency;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\Feature\FeatureTestCase;

class UsersUpdateTest extends FeatureTestCase
{
    public function test_it_renders_a_403_when_users_do_not_have_permission_to_update_users()
    {
        $loggedUser = User::factory()->create();
        $this->actingAs($loggedUser);

        $role = Role::create(['name' => 'foo']);

        $user = User::factory()->create();

        $this->put("/users/{$user->id}", [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'roles' => [$role->id],
        ])
            ->assertStatus(403);
    }

    public function test_it_updates_users()
    {
        $roleAdmin = Role::create(['name' => 'test-admin', 'role_order' => 1]);
        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_EDIT_USERS);
        $admin->assignRole($roleAdmin);
        $this->actingAs($admin);

        $roleA = Role::create(['name' => 'foo', 'role_order' => 6]);
        $roleB = Role::create(['name' => 'bar', 'role_order' => 6]);

        $user = User::factory()->create();
        $user->assignRole($roleA);

        $response = $this->put("/users/{$user->id}", [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'roles' => [$roleA->id, $roleB->id],
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'agency_id' => null,
        ]);

        $updatedUser = User::where('email', 'updated_email@empower.local')->first();

        $this->assertTrue($updatedUser->hasExactRoles([$roleA, $roleB]));

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'User updated!',
            "$updatedUser->email has been updated",
        )]);
    }

    public function test_it_updates_agency_users()
    {
        $this->logInAsAdmin();

        $agencyRole = Role::findByName(User::ROLE_AGENCY_USER);
        $oldAgency = Agency::factory()->create();
        $newAgency = Agency::factory()->create();

        $user = User::factory()->create([
            'agency_id' => $oldAgency->id,
        ]);
        $user->assignRole($agencyRole);

        $response = $this->put("/users/{$user->id}", [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'roles' => [$agencyRole->id],
            'agency_id' => $newAgency->id,
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'agency_id' => $newAgency->id,
        ]);
    }

    public function test_it_sync_users_roles()
    {
        $roleAdmin = Role::create(['name' => 'test-admin', 'role_order' => 1]);
        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_EDIT_USERS);
        $admin->assignRole($roleAdmin);
        $this->actingAs($admin);

        $roleA = Role::create(['name' => 'foo', 'role_order' => 6]);
        $roleB = Role::create(['name' => 'bar', 'role_order' => 6]);

        $user = User::factory()->create();
        $user->assignRole([$roleA, $roleB]);

        $response = $this->put("/users/{$user->id}", [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'roles' => [$roleB->id],
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
        ]);

        $updatedUser = User::where('email', 'updated_email@empower.local')->first();

        $this->assertTrue($updatedUser->hasExactRoles([$roleB]));

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'User updated!',
            "$updatedUser->email has been updated",
        )]);
    }

    public function test_it_not_sync_higher_users_roles()
    {
        $roleAdmin = Role::create(['name' => 'test-admin', 'role_order' => 2]);
        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_EDIT_USERS);
        $admin->assignRole($roleAdmin);
        $this->actingAs($admin);

        $roleA = Role::create(['name' => 'foo', 'role_order' => 1]);
        $roleB = Role::create(['name' => 'bar', 'role_order' => 1]);

        $user = User::factory()->create();
        $user->assignRole([$roleA, $roleB]);

        $response = $this->put("/users/{$user->id}", [
            'first_name' => $user->first_name,
            'last_name' => 'Updated Last Name',
            'phone_number' => $user->phone_number,
            'email' => 'updated_email@empower.local',
            'roles' => [$roleB->id],
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'error',
            'Update user error!',
            'Can not update user with the role that higher your role',
        )]);
    }
}
