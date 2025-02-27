<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\CreditStatus;
use App\Models\Agency;
use App\Models\Credit;
use App\Models\Retailer;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CreditSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $agencies = Agency::all();
        $retailers = Retailer::all();
        $date = CarbonImmutable::now()->subDays(3);
        $exportedDate = CarbonImmutable::now()->subDays(1);
        $adminUser = Role::findByName(User::ROLE_ADMIN)->users->first();

        // create some credits of each status in each agency

        for ($status = 0; $status <= CreditStatus::Rejected; $status++) {
            foreach ($agencies as $agency) {
                for ($a = 0; $a < 3; $a++) {
                    $date = $date->subMinutes(rand(25, 200));
                    Credit::factory()->create([
                        'status' => $status,
                        'agency_id' => $agency->id,
                        'retailer_id' => $retailers->random()->id,
                        'created_by_id' => $agency->users->first()->id,
                        'created_at' => $date,
                        'exported_date' => $status != CreditStatus::Requested ? $exportedDate : null,
                        'exported_by_id' => $status != CreditStatus::Requested ? $adminUser->id : null,
                        'paid_date' => $status == CreditStatus::Paid ? $date->addDays(2) : null,
                        'paid_by_id' => $status == CreditStatus::Paid ? $adminUser->id : null,
                        'admin_notes' => $status == CreditStatus::Rejected ? 'Invalid a/c number' : '',
                    ]);
                }
            }
        }
    }
}
