<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Auth\Notifications\InviteUser;
use App\Http\Session\FlashMessage;
use App\Models\Agency;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;
use Tests\Feature\FeatureTestCase;

class UsersStoreTest extends FeatureTestCase
{
    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_users()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $role = Role::create(['name' => 'foo']);

        $user = User::factory()->make();

        $this->post('/users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'roles' => [$role->id],
        ])
            ->assertStatus(403);
    }

    public function test_it_stores_agency_users()
    {
        $this->logInAsAdmin();

        $agencyRole = Role::findByName(User::ROLE_AGENCY_USER);
        $agency = Agency::factory()->create();

        $user = User::factory()->make();

        $this->post('/users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'roles' => [$agencyRole->id],
            'agency_id' => $agency->id,
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'agency_id' => $agency->id,
        ]);
    }

    public function test_it_stores_users_and_send_invitations()
    {
        Notification::fake();

        $roleAdmin = Role::create(['name' => 'test-admin', 'role_order' => 1]);
        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_CREATE_USERS);
        $admin->assignRole($roleAdmin);
        $this->actingAs($admin);

        $role = Role::create(['name' => 'foo', 'role_order' => 100]);

        Factory::create(config('app.faker_locale'));

        $user = User::factory()->make();
        $user->assignRole($role);

        $response = $this->post('/users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'roles' => [$role->id],
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'agency_id' => null,
        ]);

        $createdUser = User::where('email', $user->email)->first();

        $this->assertDatabaseHas('model_has_roles', [
            'role_id' => $role->id,
            'model_id' => $createdUser->id,
            'model_type' => User::class,
        ]);

        $date = Carbon::create(2021, 10, 8);
        Carbon::setTestNow($date);

        $this->assertDatabaseHas('user_invitations', [
            'user_id' => $createdUser->id,
        ]);

        Notification::assertSentTo(
            [$createdUser],
            InviteUser::class,
        );

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'User created!',
            "Invitation sent to $createdUser->email",
        )]);
    }

    public function test_it_not_stores_users_when_lower_role()
    {
        $roleAdmin = Role::create(['name' => 'test-admin', 'role_order' => 2]);
        $admin = User::factory()->create();
        $admin->givePermissionTo(User::PERMISSION_CREATE_USERS);
        $admin->assignRole($roleAdmin);
        $this->actingAs($admin);

        $role = Role::create(['name' => 'foo', 'role_order' => 1]);

        Factory::create(config('app.faker_locale'));

        $user = User::factory()->make();
        $user->assignRole($role);

        $response = $this->post('/users', [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'roles' => [$role->id],
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'error',
            'Create user error!',
            'Can not create user with these roles',
        )]);
    }
}
