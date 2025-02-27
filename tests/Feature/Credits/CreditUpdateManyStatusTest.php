<?php declare(strict_types=1);

namespace Tests\Feature\Credits;

use App\Enums\CreditStatus;
use App\Http\Session\FlashMessage;
use App\Models\Agency;
use App\Models\Credit;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use Carbon\Carbon;
use Tests\Feature\FeatureTestCase;

class CreditUpdateManyStatusTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->region = Region::factory()->create();
        $this->district = District::factory()->create();
        $this->retailer = Retailer::factory()->create();
        $this->region->districts()->attach($this->district);
        $this->agencyUser = User::factory()->create();
        $this->agency = Agency::factory()->create();
    }

    public function test_it_updates_many_status_to_exported()
    {
        $user = $this->logInAsAdmin();
        Carbon::setTestNow(Carbon::now());

        $credits = Credit::factory()->count(2)->create([
            'status' => CreditStatus::Requested,
        ]);
        $creditIds = $credits->pluck('id')->toArray();

        $this->put('/credits/updateManyStatus', [
            'ids' => $creditIds,
            'status' => CreditStatus::Exported,
        ])
            ->assertStatus(302)
            ->assertSessionHas('messages', [new FlashMessage(
                'success',
                'Credits updated!',
                "Credit statuses have been updated",
            )]);

        foreach ($creditIds as $id) {
            $this->assertDatabaseHas('credits', [
                'id' => $id,
                'status' => CreditStatus::Exported,
                'exported_date' => Carbon::now(),
                'exported_by_id' => $user->id,
            ]);
        }
    }

    public function test_it_updates_many_status_to_paid()
    {
        $user = $this->logInAsAdmin();
        Carbon::setTestNow(Carbon::now());

        $credits = Credit::factory()->count(2)->create([
            'status' => CreditStatus::Requested,
        ]);
        $creditIds = $credits->pluck('id')->toArray();

        $this->put('/credits/updateManyStatus', [
            'ids' => $creditIds,
            'status' => CreditStatus::Paid,
        ])
            ->assertStatus(302)
            ->assertSessionHas('messages', [new FlashMessage(
                'success',
                'Credits updated!',
                "Credit statuses have been updated",
            )]);

        foreach ($creditIds as $id) {
            $this->assertDatabaseHas('credits', [
                'id' => $id,
                'status' => CreditStatus::Paid,
                'paid_date' => Carbon::now(),
                'paid_by_id' => $user->id,
            ]);
        }
    }

    public function test_it_updates_many_status_to_rejected()
    {
        $this->logInAsAdmin();
        Carbon::setTestNow(Carbon::now());

        $credits = Credit::factory()->count(2)->create([
            'status' => CreditStatus::Exported,
        ]);
        $creditIds = $credits->pluck('id')->toArray();

        $this->put('/credits/updateManyStatus', [
            'ids' => $creditIds,
            'status' => CreditStatus::Rejected,
            'admin_notes' => 'invalid a/c number',
        ])
            ->assertStatus(302)
            ->assertSessionHas('messages', [new FlashMessage(
                'success',
                'Credits updated!',
                "Credit statuses have been updated",
            )]);

        foreach ($creditIds as $id) {
            $this->assertDatabaseHas('credits', [
                'id' => $id,
                'status' => CreditStatus::Rejected,
                'admin_notes' => 'invalid a/c number',
            ]);
        }

    }

    public function test_it_throws_validation_error_if_id_not_found()
    {
        $this->logInAsAdmin();

        $credit = Credit::factory()->create([
            'status' => CreditStatus::Requested,
        ]);
        $creditIds = [$credit->id, 99234];

        $this->put('/credits/updateManyStatus', [
            'ids' => $creditIds,
            'status' => CreditStatus::Exported,
        ])
            ->assertSessionHasErrors([
                'ids' => 'Credits not found',
            ])
            ->assertStatus(302);

        // check status not changed
        $this->assertDatabaseHas('credits', [
            'id' => $credit->id,
            'status' => CreditStatus::Requested,
        ]);
    }

    public function test_it_throws_validation_error_if_initial_statuses_not_same()
    {
        $this->logInAsAdmin();

        $credit1 = Credit::factory()->create([
            'status' => CreditStatus::Requested,
        ]);
        $credit2 = Credit::factory()->create([
            'status' => CreditStatus::Exported,
        ]);
        $creditIds = [$credit1->id, $credit2->id];

        $this->put('/credits/updateManyStatus', [
            'ids' => $creditIds,
            'status' => CreditStatus::Exported,
        ])
            ->assertSessionHasErrors([
                'ids' => 'Not all credits are in the same current status',
            ])
            ->assertStatus(302);

        // check status not changed
        $this->assertDatabaseHas('credits', [
            'id' => $credit1->id,
            'status' => CreditStatus::Requested,
        ]);
        $this->assertDatabaseHas('credits', [
            'id' => $credit2->id,
            'status' => CreditStatus::Exported,
        ]);
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_update_many_credits()
    {
        $this->logInAsAgencyAdmin();

        $this->put('/credits/updateManyStatus', [
            'ids' => [1],
            'status' => CreditStatus::Exported,
        ])
            ->assertStatus(403);
    }
}
