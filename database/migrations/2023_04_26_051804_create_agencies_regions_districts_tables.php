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
    private const PERMISSIONS = [
        Agency::PERMISSION_VIEW_AGENCIES,
        Agency::PERMISSION_CREATE_AGENCIES,
        Agency::PERMISSION_DELETE_AGENCIES,
        Agency::PERMISSION_EDIT_AGENCIES,
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // create pivot table for many-to-many relationship between regions and districts
        Schema::create('district_region', function (Blueprint $table) {
            $table->foreignId('district_id')->constrained()->onDelete('cascade');
            $table->foreignId('region_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['district_id', 'region_id']);
        });

        Schema::create('agencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // some agencies might be nationwide
            $table->foreignId('region_id')->nullable()->constrained();
            // some might be district-only, or district-wide
            $table->foreignId('district_id')->nullable()->constrained();
            $table->timestamps();
            $table->softDeletes();
        });

        // create new permissions
        foreach (self::PERMISSIONS as $name) {
            Permission::create(['name' => $name]);
        }

        $role = Role::whereName(User::ROLE_SUPER_ADMIN)->first();
        $role->givePermissionTo(self::PERMISSIONS);

        $role = Role::whereName(User::ROLE_ADMIN)->first();
        $role->givePermissionTo(self::PERMISSIONS);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        foreach (self::PERMISSIONS as $name) {
            $permission = Permission::whereName($name);
            if ($permission) {
                Permission::destroy([$permission]);
            }
        }

        Schema::dropIfExists('agencies');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('regions');
    }
};
