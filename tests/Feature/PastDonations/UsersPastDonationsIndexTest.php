<?php declare(strict_types=1);

namespace Tests\Feature\PastDonations;

use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use Tests\Feature\FeatureTestCase;

class UsersPastDonationsIndexTest extends FeatureTestCase
{
    public function test_it_renders_the_selected_users_past_donations_screen()
    {
        // make sure we don't see this donor's past donations
        $otherDonor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $otherDonor->id,
        ]);
        PastDonation::factory()->count(2)->create([
            'donation_id' => $donation->id,
        ]);

        // we only want to see this donor's donations
        $donor = User::factory()->create();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
        ]);
        PastDonation::factory()->count(3)->create([
            'donation_id' => $donation->id,
        ]);

        $this->logInAsAdmin();

        $this->get(route('users.pastDonations', ['user' => $donor]))
            ->assertInertia(fn($page) => $page
                ->component('PastDonations/UserPastDonations')
                ->where('currentTab', 'history')
                ->has('user', fn($page) => $page
                    ->where('id', $donor->id)
                    ->where('name', $donor->name)
                    ->etc()
                )
                ->has('pastDonationsPaginator', fn($page) => $page
                    ->where('total', 3)
                    ->where('per_page', 10)
                    ->has('data', 3, fn($page) => $page
                        ->has('icp')
                        ->has('amount')
                        ->has('account_number')
                        ->has('date')
                        ->has('donation', fn($page) => $page
                            ->has('id')
                            ->has('retailer')
                        )
                        ->etc()
                    )
                    ->etc()
                )
            );
    }

    public function test_it_renders_a_403_when_the_user_does_not_have_permission_to_view_past_donations()
    {
        $this->logInAsDonor();
        $donor = User::factory()->create();

        $this->get(route('users.pastDonations', ['user' => $donor]))
            ->assertStatus(403);
    }
}
