<?php

declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Http\Session\FlashMessage;
use App\Models\Donation;
use App\Models\Retailer;
use Database\Seeders\DonationSeeder;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsUpdateTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Retailer::create([
            'id' => 1,
            'name' => 'Meridian',
        ]);

        $this->seed(UserSeeder::class);
        $this->seed(DonationSeeder::class);
        $this->donation = Donation::all()->first();
        $this->donor = $this->donation->user;
    }

    public function test_it_updates_donations_for_donor()
    {
        $this->logInAsDonor($this->donor);
        $donation = $this->donation;

        $response = $this->put("/donations/{$this->donation->id}", [
            'address' => "Updated $donation->address",
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => "Updated ICP",
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => "$donation->amount",
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ]);

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'address' => "Updated $donation->address",
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => "Updated ICP",
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => $donation->amount,
            'is_dollar' => $donation->is_dollar,
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Donation updated!',
            "Donation Updated ICP has been updated",
        )]);
    }

    public function test_it_updates_donations_for_admin()
    {
        $this->logInAsAdmin();
        $donation = $this->donation;

        $response = $this->put("/donations/{$this->donation->id}", [
            'address' => "Updated $donation->address",
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => "Updated ICP",
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => "$donation->amount",
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ]);

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'address' => "Updated $donation->address",
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => "Updated ICP",
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => $donation->amount,
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Donation updated!',
            "Donation Updated ICP has been updated",
        )]);
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_update_donations()
    {
        $this->logInAsNoRole();
        $donation = $this->donation;

        $this->put("/donations/{$this->donation->id}", [
            'address' => "Updated $donation->address",
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => "Updated ICP",
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => "$donation->amount",
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ])
            ->assertStatus(403);
    }

    public function test_it_renders_a_403_when_donor_updates_other_donations()
    {
        $this->logInAsDonor();
        $donation = $this->donation;

        $this->put("/donations/{$this->donation->id}", [
            'address' => "Updated $donation->address",
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => "Updated ICP",
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => "$donation->amount",
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ])
            ->assertStatus(403);
    }
}
