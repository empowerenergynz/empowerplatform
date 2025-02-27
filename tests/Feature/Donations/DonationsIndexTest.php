<?php declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Models\Donation;
use App\Models\User;
use Database\Seeders\DonationSeeder;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsIndexTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->seed(DonationSeeder::class);
        $this->donors = User::Role(User::ROLE_DONOR)->get();
        $this->donations = Donation::get();
        $this->donor = $this->donations[0]->user;
    }

    public function test_it_renders_the_donations_screen_for_donor()
    {
        $this->logInAsDonor($this->donor);
        $nDonations = count($this->donor->donations);

        $this->get('/donations')
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/Donations')
                ->has('donationsPaginator', fn($page) => $page
                    ->where('total', $nDonations)
                    ->where('per_page', 10)
                    ->has('data', $nDonations, fn($page) => $page
                        ->where('user_id', $this->donor->id)
                        ->has('address')
                        ->has('gps_coordinates')
                        ->has('icp')
                        ->has('retailer')
                        ->has('account_number')
                        ->has('amount')
                        ->has('is_dollar')
                        ->has('buyback_rate')
                        ->has('is_active')
                        // A Donor doesn't need the user details for themselves
                        ->missing('user')
                        ->etc()
                    )
                    ->etc()
                )
            );
    }

    public function test_it_renders_the_donations_screen_for_admin()
    {
        $this->logInAsAdmin();
        $nDonations = count($this->donations);

        $this->get('/donations')
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Donations/Donations')
                ->has('donationsPaginator', fn($page) => $page
                    ->where('total', $nDonations)
                    ->where('per_page', 10)
                    ->has('data', $nDonations, fn($page) => $page
                        ->has('address')
                        ->has('gps_coordinates')
                        ->has('icp')
                        ->has('retailer')
                        ->has('account_number')
                        ->has('amount')
                        ->has('is_dollar')
                        ->has('buyback_rate')
                        ->has('is_active')
                        ->has('user_id')
                        // An Admin should receive the user details
                        ->has('user', fn($page) => $page
                            ->has('id')
                            ->has('name')
                            ->has('first_name')
                            ->has('last_name')
                            ->etc()
                        )
                        ->etc()
                    )
                    ->etc()
                )
            );
    }

    public function test_it_renders_a_403_when_user_does_not_have_permission_to_view_donations()
    {
        $this->logInAsNoRole();

        $this->get('/donations')
            ->assertStatus(403);
    }
}
