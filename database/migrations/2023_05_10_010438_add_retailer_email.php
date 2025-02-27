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
            // all balances, credits, etc. will be round dollars, no cents
            $table->string('email')->nullable();
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
            $table->dropColumn('email');
        });
    }
};
