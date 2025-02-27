<?php declare(strict_types=1);

namespace Tests\Feature\PastDonations;

use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use Tests\Feature\FeatureTestCase;

class PastDonationsIndexTest extends FeatureTestCase
{
    public function test_it_renders_the_loggedin_users_past_donations_screen()
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
        $donor = $this->logInAsDonor();
        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
        ]);
        PastDonation::factory()->count(3)->create([
            'donation_id' => $donation->id,
        ]);

        $this->get(route('history.index'))
            ->assertInertia(fn($page) => $page
                ->component('PastDonations/PastDonations')
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
}
