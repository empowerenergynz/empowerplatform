<?php declare(strict_types=1);

namespace Tests\Feature\Agencies;

use App\Models\Agency;
use App\Models\District;
use App\Models\Region;
use Tests\Feature\FeatureTestCase;

class AgenciesEditTest extends FeatureTestCase
{
    public function test_it_renders_the_form_to_edit_agencies()
    {
        $this->logInAsAdmin();

        $region = Region::factory()->create();
        $district = District::factory()->create();
        $agency = Agency::factory()->create([
            'region_id' => $region->id,
            'district_id' => $district->id,
            'balance' => 1,
        ]);

        $this->get("/agencies/{$agency->id}/edit")
            ->assertInertia(fn($page) => $page
                ->component('Agencies/CreateAgency')
                ->has('agency', fn($page) => $page
                    ->where('id', $agency->id)
                    ->where('name', $agency->name)
                    ->where('balance', 1)
                    ->where('balance_date', $agency->balance_date->format('Y-m-d\TH:i:s.u\Z'))
                    ->where('region_id', $region->id)
                    ->where('district_id', $district->id)
                    ->etc()
                )
                ->has('regions', 1)
                ->where('liveBalance', $agency->balance)
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_edit_agencies()
    {
        $this->logInAsDonor();

        $agency = Agency::factory()->create();

        $this->get("/agencies/{$agency->id}/edit")
            ->assertStatus(403);
    }
}
