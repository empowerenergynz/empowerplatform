<?php declare(strict_types=1);

namespace Unit\Models;

use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonationTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_linked_donor()
    {
        $donor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
        ]);

        $this->assertEquals($donor['first_name'], $donation->user->first_name);
    }

    public function test_get_linked_past_donations()
    {
        $donor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
        ]);
        PastDonation::factory()->count(3)->create([
            'donation_id' => $donation->id,
        ]);

        $this->assertEquals(3, count($donation->pastDonations));
    }
}
