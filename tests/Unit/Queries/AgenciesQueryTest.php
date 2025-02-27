<?php

declare(strict_types=1);

namespace Tests\Unit\Queries;

use App\Models\Agency;
use App\Models\District;
use App\Models\Region;
use App\Models\User;
use App\Queries\AgenciesQuery;
use Illuminate\Http\Request;

class AgenciesQueryTest extends QueryTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $regionG = Region::factory()->create(['name' => 'Ggg']);
        $districtA = District::factory()->create(['name' => 'Aaa distA']);
        $this->agencyZ_regG_distA_bal1 = Agency::factory()->create([
            'name' => 'Zzz AgencyZ',
            'region_id' => $regionG->id,
            'district_id' => $districtA->id,
            'balance' => 1,
        ]);

        $regionZ = Region::factory()->create(['name' => 'Zzz']);
        $districtG = District::factory()->create(['name' => 'Ggg']);
        $this->agencyB_regZ_distG_bal9 = Agency::factory()->create([
            'name' => 'Bbb',
            'region_id' => $regionZ->id,
            'district_id' => $districtG->id,
            'balance' => 9,
        ]);

        $regionA = Region::factory()->create(['name' => 'Agg regA']);
        $districtZ = District::factory()->create(['name' => 'Zzz']);
        $this->agencyG_regA_distZ_bal5 = Agency::factory()->create([
            'name' => 'Ggg',
            'region_id' => $regionA->id,
            'district_id' => $districtZ->id,
            'balance' => 5,
        ]);
    }

    public function test_that_it_returns_agencies_ordered_by_name_by_default()
    {
        $request = new Request();
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->first()->id);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->last()->id);
    }

    public function test_that_it_returns_agencies_ordered_by_name_desc()
    {
        $request = new Request(['sort' => '-name']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->first()->id);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->last()->id);
    }

    public function test_that_it_returns_agencies_ordered_by_region()
    {
        $request = new Request(['sort' => 'region']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->first()->id);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->last()->id);
    }

    public function test_that_it_returns_agencies_ordered_by_region_desc()
    {
        $request = new Request(['sort' => '-region']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->first()->id);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->last()->id);
    }

    public function test_that_it_returns_agencies_ordered_by_district()
    {
        $request = new Request(['sort' => 'district']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->first()->id);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->last()->id);
    }

    public function test_that_it_returns_agencies_ordered_by_district_desc()
    {
        $request = new Request(['sort' => '-district']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->first()->id);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->last()->id);
    }

    public function test_that_it_returns_agencies_ordered_by_balance()
    {
        $request = new Request(['sort' => 'balance']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->get(0)->id);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->get(2)->id);
    }

    public function test_that_it_returns_agencies_ordered_by_balance_desc()
    {
        $request = new Request(['sort' => '-balance']);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(3, $agencies);
        $this->assertEquals($this->agencyB_regZ_distG_bal9->id, $agencies->get(0)->id);
        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->get(1)->id);
        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->get(2)->id);
    }

    public function test_that_it_allows_the_search_filter_by_agency()
    {
        $request = new Request(['filter' => ['search' => 'encyZ']]);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(1, $agencies);

        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->first()->id);
    }

    public function test_that_it_allows_the_search_filter_by_region()
    {
        $request = new Request(['filter' => ['search' => 'ega']]);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(1, $agencies);

        $this->assertEquals($this->agencyG_regA_distZ_bal5->id, $agencies->first()->id);
    }

    public function test_that_it_allows_the_search_filter_by_district()
    {
        $request = new Request(['filter' => ['search' => 'ista']]);
        $request->setUserResolver(fn () => $this->user);
        $query = new AgenciesQuery($request);
        $agencies = $query()->get();

        $this->assertCount(1, $agencies);

        $this->assertEquals($this->agencyZ_regG_distA_bal1->id, $agencies->first()->id);
    }
}
