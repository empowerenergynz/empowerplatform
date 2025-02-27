<?php

declare(strict_types=1);

namespace Tests\Unit\Queries;

use App\Models\User;
use App\Queries\DonationsQuery;
use App\Models\Donation;
use Illuminate\Http\Request;

class DonationsQueryTest extends QueryTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->donorA = User::factory()->create([
            'first_name' => 'Fred',
            'last_name' => 'Smith',
        ]);
        $this->donorA->assignRole(User::ROLE_DONOR);

        $this->donorB = User::factory()->create([
            'first_name' => 'Alison',
            'last_name' => 'Smith',
        ]);
        $this->donorB->assignRole(User::ROLE_DONOR);

        $this->donorC = User::factory()->create([
            'first_name' => 'Zoo',
            'last_name' => 'Smith',
        ]);
        $this->donorC->assignRole(User::ROLE_DONOR);

        $this->donationA = Donation::factory()->create([
            'amount' => 1,
            'user_id' => $this->donorA->id,
        ]);
        $this->donationB = Donation::factory()->create([
            'amount' => 2,
            'user_id' => $this->donorB->id,
        ]);
        $this->donationC = Donation::factory()->create([
            'amount' => 3,
            'user_id' => $this->donorC->id,
        ]);
    }

    public function test_that_it_returns_donations_ordered_by_donor_name_by_default()
    {
        $request = new Request();
        $request->setUserResolver(fn () => $this->user);
        $query = new DonationsQuery($request);
        $donations = $query()->get();

        $this->assertCount(3, $donations);
        $this->assertEquals($this->donationB->id, $donations->first()->id);
        $this->assertEquals($this->donationA->id, $donations->get(1)->id);
        $this->assertEquals($this->donationC->id, $donations->last()->id);
    }

    public function test_that_it_returns_donations_ordered_by_donor_name_desc()
    {
        $request = new Request(['sort' => '-donor']);
        $request->setUserResolver(fn () => $this->user);
        $query = new DonationsQuery($request);
        $donations = $query()->get();

        $this->assertCount(3, $donations);
        $this->assertEquals($this->donationC->id, $donations->first()->id);
        $this->assertEquals($this->donationA->id, $donations->get(1)->id);
        $this->assertEquals($this->donationB->id, $donations->last()->id);
    }

    public function test_that_it_returns_donations_ordered_by_amount()
    {
        $request = new Request(['sort' => 'amount']);
        $request->setUserResolver(fn () => $this->user);
        $query = new DonationsQuery($request);
        $donations = $query()->get();

        $this->assertCount(3, $donations);
        $this->assertEquals($this->donationA->id, $donations->first()->id);
        $this->assertEquals($this->donationB->id, $donations->get(1)->id);
        $this->assertEquals($this->donationC->id, $donations->last()->id);
    }
}
