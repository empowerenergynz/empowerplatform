<?php declare(strict_types=1);

namespace Unit\Models;

use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PastDonationTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_linked_donation()
    {
        $donor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
        ]);
        $pastDonation = PastDonation::factory()->create([
            'donation_id' => $donation->id,
        ]);

        $this->assertEquals($donation['icp'], $pastDonation->donation->icp);
    }

    public function test_overrides_retailer_from_donation()
    {
        $donor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => 'Donation Retailer',
        ]);
        $pastDonation = PastDonation::factory()->create([
            'donation_id' => $donation->id,
            'retailer' => 'Past Donation Retailer'
        ]);

        $this->assertDatabaseHas('past_donations', [
            'donation_id' => $donation->id,
            'retailer' => 'Past Donation Retailer',
        ]);
        $this->assertEquals('Past Donation Retailer', $pastDonation->retailer);
    }

    public function test_falls_back_to_retailer_from_donation()
    {
        $donor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => 'Donation Retailer',
        ]);
        $pastDonation = PastDonation::factory()->create([
            'donation_id' => $donation->id,
        ]);

        $this->assertDatabaseHas('past_donations', [
            'donation_id' => $donation->id,
            'retailer' => null,
        ]);
        $this->assertEquals('Donation Retailer', $pastDonation->retailer);
    }
}
