<?php

declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Models\Donation;
use App\Models\User;
use Database\Seeders\DonationSeeder;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsEditTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->seed(DonationSeeder::class);
        $this->donors = User::Role(User::ROLE_DONOR)->get();
        $this->donation = Donation::all()->first();
        $this->donor = $this->donation->user;
    }

    public function test_it_renders_the_form_to_edit_donations_for_donor_without_donors()
    {
        $this->logInAsDonor($this->donor);

        $this->get("/donations/{$this->donation->id}/edit")
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/CreateDonation')
                ->has('retailers')
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
                )
                // A Donor shouldn't receive the list of Donors
                ->missing('donors')
            );
    }

    public function test_it_renders_the_form_to_edit_donations_for_admin_with_donors()
    {
        $this->logInAsAdmin();

        $this->get("/donations/{$this->donation->id}/edit")
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/CreateDonation')
                ->has('retailers')
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
                )
                // An Admin needs the list of Donors
                ->has('donors', count($this->donors), fn($page) => $page
                    ->has('id')
                    ->has('name')
                    ->has('first_name')
                    ->has('last_name')
                    ->etc()
                )
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_edit_donations()
    {
        $this->logInAsNoRole();

        $this->get("/donations/{$this->donation->id}/edit")
            ->assertStatus(403);
    }

    public function test_it_renders_a_403_when_donor_views_not_their_donation()
    {
        // this will create a new donor - not the same donor as the one being viewed
        $this->logInAsDonor();

        $this->get("/donations/{$this->donation->id}")
            ->assertStatus(403);
    }
}
