<?php

declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Http\Session\FlashMessage;
use App\Models\Donation;
use App\Models\Retailer;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsStoreTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Retailer::create([
            'id' => 1,
            'name' => 'Meridian',
        ]);

        $this->seed(UserSeeder::class);
        $this->donor = User::Role(User::ROLE_DONOR)->first();
    }

    public function test_it_stores_donations_for_donor()
    {
        $this->logInAsDonor($this->donor);

        $donation = Donation::factory()->make();

        $response = $this->post('/donations', [
            'address' => $donation->address,
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => $donation->icp,
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => "$donation->amount",
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ]);

        $this->assertDatabaseHas('donations', [
            'address' => $donation->address,
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => $donation->icp,
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
            'Donation created!',
            "Donation $donation->icp has been created",
        )]);
    }

    public function test_it_stores_donations_for_admin()
    {
        $this->logInAsAdmin();

        $donation = Donation::factory()->make();

        $response = $this->post('/donations', [
            'address' => $donation->address,
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => $donation->icp,
            'retailer' => $donation->retailer,
            'account_number' => $donation->account_number,
            'amount' => "$donation->amount",
            'is_dollar' => $donation->is_dollar,
            'buyback_rate' => $donation->is_dollar ? '0.00' : '0.42',
            'is_active' => $donation->is_active,
            'user_id' => $this->donor->id,
        ]);

        $this->assertDatabaseHas('donations', [
            'address' => $donation->address,
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => $donation->icp,
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
            'Donation created!',
            "Donation $donation->icp has been created",
        )]);
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_donations()
    {
        $this->logInAsNoRole();

        $donation = Donation::factory()->make();

        $this->post('/donations', [
            'address' => $donation->address,
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => $donation->icp,
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

    public function test_it_renders_a_403_when_donor_creates_donation_for_other_donor()
    {
        $this->logInAsDonor();

        $donation = Donation::factory()->make();

        $this->post('/donations', [
            'address' => $donation->address,
            'gps_coordinates' => $donation->gps_coordinates,
            'icp' => $donation->icp,
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
