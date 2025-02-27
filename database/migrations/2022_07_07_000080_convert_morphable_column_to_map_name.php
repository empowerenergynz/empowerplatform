<?php declare(strict_types=1);

use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class ConvertMorphableColumnToMapName extends Migration
{
    private $morphModelMapping = [
        User::MORPH_MAP_NAME => User::class,
        Donation::MORPH_MAP_NAME => Donation::class,
    ];

    private $morphTablesMapping = [
        'media' => 'model_type',
        'model_has_permissions' => 'model_type',
        'model_has_roles' => 'model_type',
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        // update all tables using the model class name and replace them with mapping names
        foreach ($this->morphModelMapping as $mapName => $className) {
            foreach ($this->morphTablesMapping as $tableName => $columnName) {
                DB::table($tableName)
                    ->where($columnName, $className)
                    ->update([
                        $columnName => $mapName,
                    ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        // update all tables using mapping names and replace them with class names
        foreach ($this->morphModelMapping as $mapName => $className) {
            foreach ($this->morphTablesMapping as $tableName => $columnName) {
                DB::table($tableName)
                    ->where($columnName, $mapName)
                    ->update([
                        $columnName => $className,
                    ]);
            }
        }
    }
}
