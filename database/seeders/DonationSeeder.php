<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Seeder;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $donors = User::role([User::ROLE_DONOR])->get();
        Donation::factory()->times(3)->create([
            'user_id' => $donors[0]->id,
        ]);
        Donation::factory()->times(2)->create([
            'user_id' => $donors[1]->id,
        ]);
    }
}
