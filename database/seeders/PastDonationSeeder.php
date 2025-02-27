<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\PastDonation;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PastDonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $donations = Donation::all();
        foreach ($donations as $donation) {
            $date = Carbon::now()->subWeek(1);
            for ($a = 0; $a < 2; $a++) {
                PastDonation::factory()->create([
                    'donation_id' => $donation->id,
                    'date' => $date->format('Y-m-d'),
                    'icp' => $donation->icp,
                    'account_number' => $donation->account_number,
                ]);
                $date->subMonth();
            }
        }
    }
}
