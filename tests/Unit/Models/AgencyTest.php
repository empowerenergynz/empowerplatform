<?php declare(strict_types=1);

namespace Unit\Models;

use App\Enums\CreditStatus;
use App\Models\Agency;
use App\Models\Credit;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgencyTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->region = Region::factory()->create();
        $this->district = District::factory()->create();
        $this->region->districts()->attach($this->district);
        Retailer::factory()->create();
        $user = User::factory()->create();
        $this->userId = $user->id;
    }

    /**
     * Test Agency model creation.
     *
     * @return void
     */
    public function test_agency_creation(): void
    {
        // Create an Agency model instance
        $agency = Agency::create([
            'name' => 'Example Agency',
            'region_id' => $this->region->id,
            'district_id' => $this->district->id,
        ]);

        // Assert that the Agency model was created successfully
        $this->assertInstanceOf(Agency::class, $agency);
        $this->assertDatabaseHas('agencies', [
            'id' => $agency->id,
            'name' => 'Example Agency',
            'region_id' => $this->region->id,
            'district_id' => $this->district->id,
        ]);
    }

    public function test_calculates_balance_correctly_scenario1_before_after(): void
    {
        // Scenario 1 - old Credit created BEFORE balance change, rejected AFTER balance change
        //   -> need to manually add rejected amount back onto the balance

        $date = Carbon::createFromFormat("m/d/Y", "01/01/2023");

        // 1. Create an Agency model instance with a balance of $1000
        /* @var Agency $agency */
        $agency = Agency::factory()->create([
            'balance' => 1000,
            'balance_date' => $date
        ]);
        // current balance should be $1000
        $this->assertEquals(1000, $agency->calculateCurrentBalance());

        // 2. create Credit Request 1 of $100 on following day
        /* @var Credit $credit1_100 */
        $credit1_100 = Credit::factory()->create([
            'amount' => 100,
            'created_at' => $date->addDay(),
        ]);
        // current balance should be $900
        $this->assertEquals(900, $agency->calculateCurrentBalance());

        // 3. Mark credit 1 as exported
        $credit1_100->setStatusAndSave(CreditStatus::Exported, $date->addDay());
        // current balance should still be $900
        $this->assertEquals(900, $agency->calculateCurrentBalance());

        // 4. Create Credit Request 2 of $200
        //  + Create Credit Request 3 of $100
        /* @var Credit $credit2_200 */
        $credit2_200 = Credit::factory()->create([
            'amount' => 200,
            'created_at' => $date->addDay(),
        ]);
        /* @var Credit $credit3_100 */
        $credit3_100 = Credit::factory()->create([
            'amount' => 100,
            'created_at' => $date->addDay(),
        ]);
        // current balance should be $600
        $this->assertEquals(600, $agency->calculateCurrentBalance());

        // 5. Empower Admin exports bill requests 2+3
        //    and updates bill request 1 to ‘PAID’.
        $date->addDay();
        $credit1_100->setStatusAndSave(CreditStatus::Paid, $date, $this->userId);
        $credit2_200->setStatusAndSave(CreditStatus::Exported, $date, $this->userId);
        $credit3_100->setStatusAndSave(CreditStatus::Exported, $date, $this->userId);
        // current balance should still be $600
        $this->assertEquals(600, $agency->calculateCurrentBalance());

        // 6. Empower Admin allocates another $1000 to Agency A in Xero.
        $agency->balance = 1600;
        $agency->balance_date = $date->addDay();
        // current balance should be $1600
        $this->assertEquals(1600, $agency->calculateCurrentBalance());

        // 7. Empower Admin rejects Credit 2
        $credit2_200->setStatusAndSave(CreditStatus::Rejected, $date->addDay(), $this->userId, 'hi');
        // balance should increase to $1800
        $this->assertEquals(1800, $agency->calculateCurrentBalance());

        // 8. create Credit Request 4 of $100 on following day
        /* @var Credit $credit4_100 */
        $credit4_100 = Credit::factory()->create([
            'amount' => 100,
            'created_at' => $date->addDay(),
        ]);
        // current balance should be $1700
        $this->assertEquals(1700, $agency->calculateCurrentBalance());

    }

    public function test_calculates_balance_correctly_scenario2_after_after(): void
    {
        // Scenario 2 - new Credit created AFTER balance change, rejected AFTER balance change
        //   -> should be ignored completely

        $date = Carbon::createFromFormat("m/d/Y", "01/01/2023");

        // 1. Create an Agency model instance with a balance of $1000
        /* @var Agency $agency */
        $agency = Agency::factory()->create([
            'balance' => 2000,
            'balance_date' => $date
        ]);
        // current balance should be $2000
        $this->assertEquals(2000, $agency->calculateCurrentBalance());

        // 2. create Credit Request 1 of $100 on following day
        /* @var Credit $credit1_100 */
        $credit1_100 = Credit::factory()->create([
            'amount' => 100,
            'created_at' => $date->addDay(),
        ]);
        // current balance should be $1900
        $this->assertEquals(1900, $agency->calculateCurrentBalance());

        // 3. Mark credit 1 as exported
        $credit1_100->setStatusAndSave(CreditStatus::Exported, $date->addDay());
        // current balance should still be $1900
        $this->assertEquals(1900, $agency->calculateCurrentBalance());

        // 4. Empower Admin allocates another $500 to Agency A in Xero.
        $agency->balance = 2400;
        $agency->balance_date = $date->addDay();
        // current balance should be $2400
        $this->assertEquals(2400, $agency->calculateCurrentBalance());

        // 5. create Credit Request 2 of $1000
        /* @var Credit $credit2_1000 */
        $credit2_1000 = Credit::factory()->create([
            'amount' => 1000,
            'created_at' => $date->addDay(),
        ]);
        // current balance should be $1400
        $this->assertEquals(1400, $agency->calculateCurrentBalance());

        // 6. Empower Admin rejects Credit 2
        $credit2_1000->setStatusAndSave(CreditStatus::Rejected, $date->addDay(), $this->userId, 'hi');
        // balance should go back to $2400
        $this->assertEquals(2400, $agency->calculateCurrentBalance());
    }

    public function test_calculates_balance_correctly_scenario3_before_before(): void
    {
        // Scenario 3 - new Credit created BEFORE balance change, rejected BEFORE balance change
        //   -> should be ignored completely

        $date = Carbon::createFromFormat("m/d/Y", "01/01/2023");

        // 1. Create an Agency model instance with a balance of $0
        /* @var Agency $agency */
        $agency = Agency::factory()->create([
            'balance' => 0,
            'balance_date' => $date
        ]);
        // current balance should be $0
        $this->assertEquals(0, $agency->calculateCurrentBalance());

        // 2. create Credit Request 1 of $100 on following day
        /* @var Credit $credit1_100 */
        $credit1_100 = Credit::factory()->create([
            'amount' => 100,
            'created_at' => $date->addDay(),
        ]);
        // current balance should be $-100
        $this->assertEquals(-100, $agency->calculateCurrentBalance());

        // 3. Mark credit 1 as rejected
        $credit1_100->setStatusAndSave(CreditStatus::Rejected, $date->addDay());
        // current balance should be back to 0
        $this->assertEquals(0, $agency->calculateCurrentBalance());

        // 4. Empower Admin allocates $500 to Agency A in Xero.
        $agency->balance = 500;
        $agency->balance_date = $date->addDay();
        // current balance should be $500
        $this->assertEquals(500, $agency->calculateCurrentBalance());
    }
}
