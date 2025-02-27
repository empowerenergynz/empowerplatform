<?php declare(strict_types=1);

namespace Tests\Feature\Credits;

use App\Enums\CreditStatus;
use App\Http\Session\FlashMessage;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use App\Notifications\CreditCreated;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Tests\Feature\FeatureTestCase;

class CreditStoreTest extends FeatureTestCase
{
    private Region $region;
    private District $district;
    private Retailer $retailer;

    public function setUp(): void
    {
        parent::setUp();

        $this->region = Region::factory()->create();
        $this->district = District::factory()->create();
        $this->retailer = Retailer::factory()->create();
        $this->region->districts()->attach($this->district);
    }

    public function test_it_stores_a_credit()
    {
        Notification::fake();

        $admin = User::factory()->create();
        $admin->assignRole(User::ROLE_ADMIN);

        $user = $this->logInAsAgencyUser();
        Carbon::setTestNow(Carbon::now());

        $name = 'Bob Client';

        $response = $this->post('/credits', [
            'name' => $name,
            'amount' => '123',
            'notes' => 'a random amount',
            'account' => '123456',
            'region_id' => $this->region->id,
            'district_id' => $this->district->id,
            'retailer_id' => $this->retailer->id,
        ])
            ->assertStatus(302);

        $this->assertDatabaseHas('credits', [
            'name' => $name,
            'amount' => 123,
            'notes' => 'a random amount',
            'account' => '123456',
            'region_id' => $this->region->id,
            'district_id' => $this->district->id,
            'retailer_id' => $this->retailer->id,
            'agency_id' => $user->agency_id,
            'created_at' => Carbon::now(),
            'created_by_id' => $user->id,
            'status' => CreditStatus::Requested,
        ]);

        $response->assertSessionHas('messages', [new FlashMessage(
            'success',
            'Credit created!',
            "Credit for Bob Client has been created",
        )]);

        Notification::assertSentTo($admin, function (CreditCreated $notification) use ($name) {
            return $notification->credit->name === $name;
        });
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_store_credits()
    {
        $this->logInAsDonor();

        $this->post('/credits', [
            'name' => 'Bob Client',
            'amount' => '123',
            'notes' => 'a random amount',
            'account' => '123456',
            'region_id' => $this->region->id,
            'district_id' => $this->district->id,
            'retailer_id' => $this->retailer->id,
        ])
            ->assertStatus(403);
    }
}
