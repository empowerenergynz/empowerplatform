<?php declare(strict_types=1);

use App\Models\PastDonation;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    private const permissionMatrix = [
        User::ROLE_SUPER_ADMIN => [
            PastDonation::PERMISSION_VIEW_PAST_DONATIONS,
            PastDonation::PERMISSION_CREATE_PAST_DONATIONS,
            PastDonation::PERMISSION_EDIT_PAST_DONATIONS,
        ],
        User::ROLE_ADMIN => [
            PastDonation::PERMISSION_VIEW_PAST_DONATIONS,
            PastDonation::PERMISSION_CREATE_PAST_DONATIONS,
            PastDonation::PERMISSION_EDIT_PAST_DONATIONS,
        ],
        User::ROLE_DONOR => [
            PastDonation::PERMISSION_VIEW_PAST_DONATIONS,
        ],
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('past_donations', function (Blueprint $table) {
            $table->id();
            $table->string('icp');
            $table->date('date');
            $table->decimal('amount', 8, 2);
            $table->string('account_number');
            $table->foreignId('donation_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Permission::create(['name' => PastDonation::PERMISSION_VIEW_PAST_DONATIONS]);
        Permission::create(['name' => PastDonation::PERMISSION_CREATE_PAST_DONATIONS]);
        Permission::create(['name' => PastDonation::PERMISSION_EDIT_PAST_DONATIONS]);
        Permission::create(['name' => PastDonation::PERMISSION_DELETE_PAST_DONATIONS]);

        foreach (self::permissionMatrix as $roleName => $permissions) {
            $role = Role::where('name', $roleName)->first();
            $role->givePermissionTo($permissions);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        foreach (self::permissionMatrix as $roleName => $permissions) {
            $role = Role::where('name', $roleName)->first();
            $role->revokePermissionTo($permissions);
        }

        Permission::where('name', PastDonation::PERMISSION_VIEW_PAST_DONATIONS)->delete();
        Permission::where('name', PastDonation::PERMISSION_CREATE_PAST_DONATIONS)->delete();
        Permission::where('name', PastDonation::PERMISSION_EDIT_PAST_DONATIONS)->delete();
        Permission::where('name', PastDonation::PERMISSION_DELETE_PAST_DONATIONS)->delete();

        Schema::dropIfExists('past_donations');
    }
};
