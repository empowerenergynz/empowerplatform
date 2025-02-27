<?php declare(strict_types=1);

use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
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
        Permission::create(['name' => Donation::PERMISSION_EXPORT_DONATIONS]);
        Role::where('name', User::ROLE_ADMIN)
            ->first()
            ->givePermissionTo([Donation::PERMISSION_EXPORT_DONATIONS]);
        Role::where('name', User::ROLE_SUPER_ADMIN)
            ->first()
            ->givePermissionTo([Donation::PERMISSION_EXPORT_DONATIONS]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Role::where('name', User::ROLE_SUPER_ADMIN)
            ->first()
            ->revokePermissionTo([Donation::PERMISSION_EXPORT_DONATIONS]);
        Role::where('name', User::ROLE_ADMIN)
            ->first()
            ->revokePermissionTo([Donation::PERMISSION_EXPORT_DONATIONS]);
        Permission::where(['name' => Donation::PERMISSION_EXPORT_DONATIONS])->delete();
    }
};
