<?php declare(strict_types=1);

use App\Models\Agency;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Permission::create(['name' => Agency::PERMISSION_VIEW_OWN_AGENCY_BALANCE]);

        $role = Role::whereName(User::ROLE_AGENCY_ADMIN)->first();
        $role->givePermissionTo([
            Agency::PERMISSION_VIEW_OWN_AGENCY_BALANCE,
        ]);

        $role = Role::whereName(User::ROLE_AGENCY_USER)->first();
        $role->givePermissionTo([
            Agency::PERMISSION_VIEW_OWN_AGENCY_BALANCE,
        ]);

        Schema::table('credits', function (Blueprint $table) {
            $table->timestamp('rejected_date')->nullable();
            $table->foreignId('rejected_by_id')->nullable()->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('credits', function (Blueprint $table) {
            $table->dropColumn(['rejected_date', 'rejected_by_id']);
        });

        $permission = Permission::whereName(Agency::PERMISSION_VIEW_OWN_AGENCY_BALANCE);
        if ($permission) {
            Permission::destroy([$permission]);
        }
    }
};
