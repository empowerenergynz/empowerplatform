<?php declare(strict_types=1);

use App\Models\User;
use App\Models\Donation;
use App\Providers\AuthServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class InitRolesAndPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        // create permissions
        Permission::create(['name' => AuthServiceProvider::PERMISSION_VIEW_SETTINGS]);
        Permission::create(['name' => User::PERMISSION_VIEW_USERS]);
        Permission::create(['name' => User::PERMISSION_CREATE_USERS]);
        Permission::create(['name' => User::PERMISSION_EDIT_USERS]);
        Permission::create(['name' => User::PERMISSION_DELETE_USERS]);

        Permission::create(['name' => Donation::PERMISSION_VIEW_DONATIONS]);
        Permission::create(['name' => Donation::PERMISSION_CREATE_DONATIONS]);
        Permission::create(['name' => Donation::PERMISSION_EDIT_DONATIONS]);
        Permission::create(['name' => Donation::PERMISSION_DELETE_DONATIONS]);

        // create roles and assign created permissions
        Role::create([
            'name' => User::ROLE_SUPER_ADMIN,
            'description' => 'Super Admins control everything.',
            'color' => '#E9AEAE',
            'role_order' => 1,
        ])
            ->givePermissionTo([AuthServiceProvider::PERMISSION_VIEW_SETTINGS])
            ->givePermissionTo([User::PERMISSION_VIEW_USERS])
            ->givePermissionTo([User::PERMISSION_CREATE_USERS])
            ->givePermissionTo([User::PERMISSION_EDIT_USERS])
            ->givePermissionTo([User::PERMISSION_DELETE_USERS])
            ->givePermissionTo([Donation::PERMISSION_VIEW_DONATIONS])
            ->givePermissionTo([Donation::PERMISSION_CREATE_DONATIONS])
            ->givePermissionTo([Donation::PERMISSION_EDIT_DONATIONS])
        ;

        Role::create([
            'name' => User::ROLE_ADMIN,
            'description' => 'Admins can do most things.',
            'color' => '#F9C49B',
            'role_order' => 10,
        ])
            ->givePermissionTo([AuthServiceProvider::PERMISSION_VIEW_SETTINGS])
            ->givePermissionTo([User::PERMISSION_VIEW_USERS])
            ->givePermissionTo([User::PERMISSION_CREATE_USERS])
            ->givePermissionTo([User::PERMISSION_EDIT_USERS])
            ->givePermissionTo([User::PERMISSION_DELETE_USERS])
            ->givePermissionTo([Donation::PERMISSION_VIEW_DONATIONS])
            ->givePermissionTo([Donation::PERMISSION_CREATE_DONATIONS])
            ->givePermissionTo([Donation::PERMISSION_EDIT_DONATIONS])
        ;

        Role::create([
            'name' => User::ROLE_DONOR,
            'description' => "Donors can manage their own donations.",
            'color' => '#AEE9D1',
            'role_order' => 80,
        ])
            ->givePermissionTo([Donation::PERMISSION_VIEW_DONATIONS])
            ->givePermissionTo([Donation::PERMISSION_CREATE_DONATIONS])
            ->givePermissionTo([Donation::PERMISSION_EDIT_DONATIONS])
        ;
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("DELETE FROM role_has_permissions WHERE true");

        DB::statement("DELETE FROM permissions WHERE true");

        DB::statement("DELETE FROM roles WHERE true");
    }
}
