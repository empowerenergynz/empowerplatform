<?php declare(strict_types=1);

namespace Tests\Feature\Agencies;

use App\Http\Session\FlashMessage;
use App\Models\Agency;
use App\Models\District;
use App\Models\Region;
use Carbon\Carbon;
use Tests\Feature\FeatureTestCase;

class AgenciesStoreTest extends FeatureTestCase
{
    public function test_it_stores_agencies()
    {
        $this->logInAsAdmin();

        $agency = Agency::factory()->make();
        $region = Region::factory()->create();
        $district = District::factory()->create();

        $date = Carbon::now();
        $response = $this->post('/agencies', [
            'name' => $agency->name,
            'balance' => 1,
            'balance_date' => $date->format('c'),
            'region_id' => $region->id,
            'district_id' => $district->id,
        ])
            ->assertStatus(302);

        $this->assertDatabaseHas('agencies', [
            'name' => $agency->name,
            'balance' => 1,
            'balance_date' => $date,
            'region_id' => $region->id,
            'district_id' => $district->id,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Agency created!',
            "Agency $agency->name has been created",
        )]);
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_agencies()
    {
        $this->logInAsDonor();

        $agency = Agency::factory()->make();

        $this->post('/agencies', [
            'name' => $agency->name,
            'balance' => $agency->balance,
            'balance_date' => $agency->balance_date,
        ])
            ->assertStatus(403);
    }
}
