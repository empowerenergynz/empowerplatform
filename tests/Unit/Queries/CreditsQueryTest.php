<?php

declare(strict_types=1);

namespace Tests\Unit\Queries;

use App\Models\Agency;
use App\Models\Credit;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use App\Queries\CreditsQuery;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class CreditsQueryTest extends QueryTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $region = Region::factory()->create();
        $district = District::factory()->create();
        $region->districts()->attach($district);
        Retailer::factory()->create();
        Agency::factory()->create();

        $date = CarbonImmutable::now();

        // create them in a different order than the default sort (reverse date)
        $this->credit2 = Credit::factory()->create([
            'created_at' => $date->subDays(2),
        ]);

        $this->credit3 = Credit::factory()->create([
            'created_at' => $date->subDays(3),
        ]);

        $this->credit1 = Credit::factory()->create([
            'created_at' => $date->subDays(1),
        ]);

    }

    public function test_that_it_returns_credits_ordered_by_reverse_date_by_default()
    {
        $request = new Request();
        $request->setUserResolver(fn () => $this->user);
        $query = new CreditsQuery($request);
        $credits = $query()->get();

        $this->assertCount(3, $credits);
        $this->assertEquals($this->credit1->id, $credits->get(0)->id);
        $this->assertEquals($this->credit2->id, $credits->get(1)->id);
        $this->assertEquals($this->credit3->id, $credits->get(2)->id);
    }
}
