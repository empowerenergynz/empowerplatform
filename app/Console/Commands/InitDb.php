<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class InitDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'init:db';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create local database, if it does not exist';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $database = config('database.default');

        if ($database === 'sqlite') {
            $dbFile = config('database.connections.sqlite.database');

            if (File::exists($dbFile)) {
                Log:info("Database file already exists: {$dbFile}");
            } else {
                File::put($dbFile, '');
                Log::info("Created database file: {$dbFile}");
            }
        } else {
            Log::info('No database to init.');
        }
        return Command::SUCCESS;
    }
}
