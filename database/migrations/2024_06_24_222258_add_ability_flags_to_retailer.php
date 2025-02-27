<?php declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('retailers', function (Blueprint $table) {
            // Retailer appears in Credit Allocation form
            $table->boolean('can_allocate_credit')->default(true);
            // Retailer appears in Add Donation form
            $table->boolean('can_donate')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('retailers', function (Blueprint $table) {
            $table->dropColumn('can_donate');
            $table->dropColumn('can_allocate_credit');
        });
    }
};
