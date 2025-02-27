<?php

declare(strict_types=1);

namespace Tests\Feature\Agencies;

use App\Models\Agency;
use App\Models\District;
use App\Models\Region;
use Tests\Feature\FeatureTestCase;

class AgenciesShowTest extends FeatureTestCase
{
    private Agency $agency;
    private Region $region;
    private District $district;

    public function setUp(): void
    {
        parent::setUp();

        $this->region = Region::factory()->create();
        $this->district = District::factory()->create();
        $this->region->districts()->attach($this->district);
        $this->agency = Agency::factory()->create();
    }

    public function test_it_renders_the_screen_to_show_individual_agency()
    {
        $this->logInAsAdmin();

        $this->get(route('agencies.show', ['agency' => $this->agency]))
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Agencies/ShowAgency')
                ->has('agency', fn($page) => $page
                    ->where('id', $this->agency->id)
                    ->where('name', $this->agency->name)
                    ->where('balance', $this->agency->balance)
                    ->where('balance_date', $this->agency->balance_date->format('Y-m-d\TH:i:s.u\Z'))
                    ->where('region_id', $this->region->id)
                    ->where('region.name', $this->region->name)
                    ->where('district_id', $this->district->id)
                    ->where('district.name', $this->district->name)
                    ->etc()
                )
                ->where('liveBalance', $this->agency->balance)
            );
    }

    public function test_it_renders_a_403_for_user_without_permission()
    {
        $this->logInAsDonor();

        $this->get(route('agencies.show', ['agency' => $this->agency]))
            ->assertStatus(403);
    }
}
