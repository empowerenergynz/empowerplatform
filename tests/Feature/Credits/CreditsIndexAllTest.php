<?php declare(strict_types=1);

namespace Tests\Feature\Credits;

use App\Models\Agency;
use App\Models\Credit;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;
use Tests\Feature\FeatureTestCase;

class CreditsIndexAllTest extends FeatureTestCase
{
    public function test_it_renders_the_all_credits_screen_for_admin()
    {
        $this->logInAsAdmin();

        $region = Region::factory()->create();
        $district = District::factory()->create();
        $region->districts()->attach($district);
        Retailer::factory()->create();
        Agency::factory()->create();
        // make sure this one is first
        $credit = Credit::factory()->create([
            'created_at' => Carbon::now()->subWeek(1),
        ]);
        Credit::factory()->count(2)->create();

        $this->get('/credits')
            ->assertInertia(fn($page) => $page
                ->component('Credits/Credits')
                ->has('creditsPaginator', fn(AssertableInertia $page) => $page
                    ->has('total')
                    ->where('per_page', 200)
                    ->has('data', 3)
                    // data we need for display and CSV export
                    ->where('data.0.agency.name', $credit->agency->name)
                    ->where('data.0.region.name', $credit->region->name)
                    ->where('data.0.district.name', $credit->district->name)
                    ->where('data.0.retailer.name', $credit->retailer->name)
                    ->where('data.0.retailer.account_name', $credit->retailer->account_name)
                    ->where('data.0.retailer.particulars', $credit->retailer->particulars)
                    ->where('data.0.retailer.code', $credit->retailer->code)
                    ->where('data.0.retailer.reference', $credit->retailer->reference)
                    ->where('data.0.retailer.email', $credit->retailer->email)
                    ->etc()
            ))
        ;
    }

    public function test_it_renders_the_all_credits_screen_for_agency_admin()
    {
        $region = Region::factory()->create();
        $district = District::factory()->create();
        $region->districts()->attach($district);
        Retailer::factory()->create();

        $agency = Agency::factory()->create();
        $this->logInAsAgencyAdmin($agency);

        $otherAgency = Agency::factory()->create();

        Credit::factory()->create([
            'agency_id' => $agency->id,
        ]);
        Credit::factory()->count(2)->create([
            'agency_id' => $otherAgency->id,
        ]);

        $this->get('/credits')
            ->assertInertia(fn($page) => $page
                ->component('Credits/Credits')
                ->has('creditsPaginator', fn(AssertableInertia $page) => $page
                    ->has('total')
                    ->where('per_page', 200)
                    ->has('data', 1)
                    ->where('data.0.agency.name', $agency->name)
                    ->etc()
                ))
        ;
    }

    public function test_it_redirects_the_user_when_he_does_not_have_permission_to_view_all_credits()
    {
        $this->logInAsDonor();

        $this->get('/credits')
            ->assertStatus(403);
    }
}
