<?php declare(strict_types=1);

namespace Tests\Feature\Agencies;

use App\Http\Session\FlashMessage;
use App\Models\Agency;
use App\Models\District;
use App\Models\Region;
use Carbon\Carbon;
use Tests\Feature\FeatureTestCase;

class AgenciesUpdateTest extends FeatureTestCase
{
    public function test_it_updates_agencies()
    {
        $this->logInAsAdmin();

        $oldRegion = Region::factory()->create();
        $oldDistrict = District::factory()->create();
        $agency = Agency::factory()->create([
            'name' => 'Old Name',
            'balance' => 1,
            'region_id' => $oldRegion->id,
            'district_id' => $oldDistrict->id,
        ]);
        $newRegion = Region::factory()->create();
        $newDistrict = District::factory()->create();

        $date = Carbon::now();
        $response = $this->put("/agencies/{$agency->id}", [
            'name' => 'New Name',
            'balance' => 2,
            'balance_date' => $date->format('c'),
            'region_id' => $newRegion->id,
            'district_id' => $newDistrict->id
        ])
            ->assertStatus(302);

        $this->assertDatabaseHas('agencies', [
            'id' => $agency->id,
            'name' => 'New Name',
            'balance' => 2,
            'balance_date' => $date,
            'region_id' => $newRegion->id,
            'district_id' => $newDistrict->id
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Agency updated!',
            "Agency New Name has been updated",
        )]);
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_update_agencies()
    {
        $this->logInAsDonor();
        $agency = Agency::factory()->create();

        $this->put("/agencies/{$agency->id}", [
            'name' => $agency->name,
            'balance' => $agency->balance,
            'balance_date' => $agency->balance_date,
        ])
            ->assertStatus(403);
    }
}
