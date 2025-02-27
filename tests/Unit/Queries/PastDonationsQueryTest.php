<?php

declare(strict_types=1);

namespace Tests\Unit\Queries;

use App\Models\PastDonation;
use App\Models\User;
use App\Models\Donation;
use App\Queries\PastDonationsQuery;
use Illuminate\Http\Request;

class PastDonationsQueryTest extends QueryTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->donor = User::factory()->create();
        $this->donor->assignRole(User::ROLE_DONOR);

        $this->donation = Donation::factory()->create([
            'user_id' => $this->donor->id,
        ]);

        $this->pastDonationA = PastDonation::factory()->create([
            'donation_id' => $this->donation->id,
            'date' => '2020-04-01',
        ]);
        $this->pastDonationB = PastDonation::factory()->create([
            'donation_id' => $this->donation->id,
            'date' => '2022-04-01',
        ]);
        $this->pastDonationC = PastDonation::factory()->create([
            'donation_id' => $this->donation->id,
            'date' => '2021-04-01',
        ]);
    }

    public function test_that_it_returns_past_donations_ordered_by_descending_date_by_default()
    {
        $request = new Request();
        $request->setUserResolver(fn () => $this->user);
        $query = new PastDonationsQuery($request);
        $pastDonations = $query()->get();

        $this->assertCount(3, $pastDonations);
        $this->assertEquals($this->pastDonationB->id, $pastDonations->first()->id);
        $this->assertEquals($this->pastDonationC->id, $pastDonations->get(1)->id);
        $this->assertEquals($this->pastDonationA->id, $pastDonations->last()->id);
    }

    public function test_that_it_returns_donations_ordered_by_ascending_date()
    {
        $request = new Request(['sort' => 'date']);
        $request->setUserResolver(fn () => $this->user);
        $query = new PastDonationsQuery($request);
        $pastDonations = $query()->get();

        $this->assertCount(3, $pastDonations);
        $this->assertEquals($this->pastDonationA->id, $pastDonations->first()->id);
        $this->assertEquals($this->pastDonationC->id, $pastDonations->get(1)->id);
        $this->assertEquals($this->pastDonationB->id, $pastDonations->last()->id);
    }
}
