<?php

declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Models\Donation;
use Database\Seeders\DonationSeeder;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsShowTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->seed(DonationSeeder::class);
        $this->donation = Donation::all()->first();
        $this->donor = $this->donation->user;
    }

    public function test_it_renders_the_show_donations_screen_for_donor()
    {
        $this->logInAsDonor($this->donor);

        $this->get("/donations/{$this->donation->id}")
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/ShowDonation')
                ->has('donation', fn($page) => $page
                    ->where('id', $this->donation->id)
                    ->where('address', $this->donation->address)
                    ->where('gps_coordinates', $this->donation->gps_coordinates)
                    ->where('icp', $this->donation->icp)
                    ->where('retailer', $this->donation->retailer)
                    ->where('account_number', $this->donation->account_number)
                    ->where('amount', $this->donation->amount)
                    ->where('is_dollar', $this->donation->is_dollar)
                    ->where('buyback_rate', $this->donation->buyback_rate)
                    ->where('is_active', $this->donation->is_active)
                    ->where('user_id', $this->donor->id)
                    ->missing('user')
                )
            );
    }

    public function test_it_renders_the_show_donations_screen_with_user_name_for_admin()
    {
        $this->logInAsAdmin();

        $this->get("/donations/{$this->donation->id}")
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/ShowDonation')
                ->has('donation', fn($page) => $page
                    ->where('id', $this->donation->id)
                    ->where('address', $this->donation->address)
                    ->where('gps_coordinates', $this->donation->gps_coordinates)
                    ->where('icp', $this->donation->icp)
                    ->where('retailer', $this->donation->retailer)
                    ->where('account_number', $this->donation->account_number)
                    ->where('amount', $this->donation->amount)
                    ->where('is_dollar', $this->donation->is_dollar)
                    ->where('buyback_rate', $this->donation->buyback_rate)
                    ->where('is_active', $this->donation->is_active)
                    ->where('user_id', $this->donation->user_id)
                    ->has('user', fn($page) => $page
                        ->where('id', $this->donor->id)
                        ->where('first_name', $this->donor->first_name)
                        ->where('last_name', $this->donor->last_name)
                        ->where('name', $this->donor->name)
                        ->etc()
                    )
                )
            );
    }

    public function test_it_renders_a_403_when_they_do_not_have_permission_to_view_donations()
    {
        $this->logInAsNoRole();

        $this->get("/donations/{$this->donation->id}")
            ->assertStatus(403);
    }

    public function test_it_renders_a_403_when_donor_views_not_their_donation()
    {
        $this->logInAsDonor();

        $this->get("/donations/{$this->donation->id}")
            ->assertStatus(403);
    }
}
