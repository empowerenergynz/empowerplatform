<?php declare(strict_types=1);

use App\Models\Credit;
use App\Models\PastDonation;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    private const PERMISSIONS = [
        Credit::PERMISSION_VIEW_ALL_CREDITS,
        Credit::PERMISSION_VIEW_AGENCY_CREDITS,
        Credit::PERMISSION_CREATE_CREDITS,
        Credit::PERMISSION_EDIT_ALL_CREDITS,
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('retailers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('account_name')->default('');
            $table->string('account_number')->default('');
            $table->string('particulars')->default('');
            $table->string('code')->default('');
            $table->string('reference')->default('');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('credits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('account');
            $table->integer('amount');
            $table->integer('status');
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('exported_date')->nullable();
            $table->timestamp('paid_date')->nullable();

            $table->foreignId('retailer_id')->constrained();
            $table->foreignId('region_id')->constrained();
            $table->foreignId('district_id')->constrained();
            $table->foreignId('agency_id')->constrained();
            $table->foreignId('created_by_id')->nullable()->references('id')->on('users');
            $table->foreignId('exported_by_id')->nullable()->references('id')->on('users');
            $table->foreignId('paid_by_id')->nullable()->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });

        // create new permissions
        foreach (self::PERMISSIONS as $name) {
            Permission::create(['name' => $name]);
        }

        $adminPermissions = [
            Credit::PERMISSION_VIEW_ALL_CREDITS,
            Credit::PERMISSION_EDIT_ALL_CREDITS,
        ];
        $role = Role::whereName(User::ROLE_SUPER_ADMIN)->first();
        $role->givePermissionTo($adminPermissions);

        $role = Role::whereName(User::ROLE_ADMIN)->first();
        $role->givePermissionTo($adminPermissions);

        $role = Role::whereName(User::ROLE_AGENCY_ADMIN)->first();
        $role->givePermissionTo([
            Credit::PERMISSION_CREATE_CREDITS,
            Credit::PERMISSION_VIEW_AGENCY_CREDITS,
        ]);

        $role = Role::whereName(User::ROLE_AGENCY_USER)->first();
        $role->givePermissionTo([
            Credit::PERMISSION_CREATE_CREDITS,
        ]);

        // we also need to create this new permission and assign it to Donor users
        // so we can fix the main menu
        Permission::create(['name' => PastDonation::PERMISSION_VIEW_OWN_PAST_DONATIONS]);
        $role = Role::whereName(User::ROLE_DONOR)->first();
        $role->givePermissionTo([
            PastDonation::PERMISSION_VIEW_OWN_PAST_DONATIONS,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        $allPermissions = array_merge(self::PERMISSIONS, [PastDonation::PERMISSION_VIEW_OWN_PAST_DONATIONS]);
        foreach ($allPermissions as $name) {
            $permission = Permission::whereName($name);
            if ($permission) {
                Permission::destroy([$permission]);
            }
        }

        Schema::dropIfExists('retailers');
        Schema::dropIfExists('credits');
    }
};
