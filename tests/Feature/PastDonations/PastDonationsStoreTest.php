<?php

declare(strict_types=1);

namespace Tests\Feature\PastDonations;

use App\Http\Session\FlashMessage;
use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class PastDonationsStoreTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->donor = User::Role(User::ROLE_DONOR)->first();
        $this->donation = Donation::factory()->create([
            'user_id' => $this->donor->id,
        ]);
    }

    public function test_it_stores_past_donations_for_admin()
    {
        $this->logInAsAdmin();

        $pastDonation = PastDonation::factory()->make();

        $response = $this->post("/donations/{$this->donation->id}/history", [
            'icp' => $pastDonation->icp,
            'account_number' => $pastDonation->account_number,
            'amount' => "$pastDonation->amount",
            'date' => '2022-01-01',
        ])
            ->assertStatus(302);

        $this->assertDatabaseHas('past_donations', [
            'icp' => $pastDonation->icp,
            'account_number' => $pastDonation->account_number,
            'amount' => $pastDonation->amount,
            'donation_id' => $this->donation->id,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Donation recorded!',
            "A donation for $pastDonation->icp has been recorded",
        )]);
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_past_donations()
    {
        $this->logInAsNoRole();

        $pastDonation = PastDonation::factory()->make();

        $this->post("/donations/{$this->donation->id}/history", [
            'icp' => $pastDonation->icp,
            'account_number' => $pastDonation->account_number,
            'amount' => "$pastDonation->amount",
            'date' => '2022-01-01',
        ])
            ->assertStatus(403);
    }
}
