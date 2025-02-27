<?php

declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Models\Retailer;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsCreateTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->donors = User::Role(User::ROLE_DONOR)->get();
        $this->donor = $this->donors[0];
    }

    public function test_it_renders_the_form_to_create_a_donation_for_donor_without_donors()
    {
        $this->logInAsDonor();

        $this->get('/donations/create')
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/CreateDonation')
                ->has('retailers')
                // A Donor shouldn't receive the list of donors
                ->missing('donors')
            );
    }

    public function test_it_renders_the_form_with_only_donatable_retailers()
    {
        Retailer::create([
            'id' => 1,
            'name' => 'Can Donate',
            'can_donate' => true,
        ]);

        Retailer::create([
            'id' => 2,
            'name' => 'Can\'t Donate',
            'can_donate' => false,
        ]);

        $this->logInAsDonor();

        $this->get('/donations/create')
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/CreateDonation')
                ->has('retailers', 1)
                ->where('retailers.0', 'Can Donate')
                // A Donor shouldn't receive the list of donors
                ->missing('donors')
            );
    }

    public function test_it_renders_the_form_to_create_a_donation_for_admin_with_donors()
    {
        $this->logInAsAdmin();

        $this->get('/donations/create')
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/CreateDonation')
                ->has('retailers')
                // An Admin needs the list of donors
                ->has('donors', count($this->donors), fn($page) => $page
                    ->has('id')
                    ->has('name')
                    ->has('first_name')
                    ->has('last_name')
                    ->etc()
                )
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_donations()
    {
        $this->logInAsNoRole();

        $this->get('/donations/create')
            ->assertStatus(403);
    }
}
