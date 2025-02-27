<?php declare(strict_types=1);

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    private const PERMISSIONS = [
        User::PERMISSION_VIEW_AGENCY_USERS,
        User::PERMISSION_CREATE_AGENCY_USERS,
        User::PERMISSION_EDIT_AGENCY_USERS,
        User::PERMISSION_DELETE_AGENCY_USERS,
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('agency_id')->nullable()->constrained();
        });

        // create new permissions
        foreach (self::PERMISSIONS as $name) {
            Permission::create(['name' => $name]);
        }

        Role::create([
            'name' => User::ROLE_AGENCY_ADMIN,
            'description' => 'Agency Admins can create Agency Users and Bill Credits',
            'color' => '#736dc5',
            'role_order' => 20,
        ])
            ->givePermissionTo(self::PERMISSIONS);

        Role::create([
            'name' => User::ROLE_AGENCY_USER,
            'description' => 'Agency Users can create Bill Credits',
            'color' => '#ada9e2',
            'role_order' => 30,
        ]);

        // Super Admins and Empower Admins can also create Agency Users
        $role = Role::findByName(User::ROLE_SUPER_ADMIN);
        $role->givePermissionTo(self::PERMISSIONS);

        $role = Role::findByName(User::ROLE_ADMIN);
        $role->givePermissionTo(self::PERMISSIONS);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('agency_id');
        });

        Role::findByName(User::ROLE_AGENCY_ADMIN)->delete();
        Role::findByName(User::ROLE_AGENCY_USER)->delete();

        foreach (self::PERMISSIONS as $name) {
            $permission = Permission::findByName($name);
            if ($permission) {
                Permission::destroy([$permission]);
            }
        }

    }
};
