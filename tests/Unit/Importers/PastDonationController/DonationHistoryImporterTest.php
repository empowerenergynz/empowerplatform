<?php declare(strict_types=1);

namespace Unit\Importers;

use App\Importers\DonationHistoryImporter;
use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\Retailer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use League\Csv\Exception as CsvException;
use League\Csv\Reader;
use Tests\TestCase;

class DonationHistoryImporterTest extends TestCase
{
    use RefreshDatabase;

    public function test_fails_on_empty_file()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/empty_file.csv');

        $this->expectException(CsvException::class);

        $csv->setHeaderOffset(0);
        $csv->getHeader();
    }

    public function test_fails_on_invalid_header()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/invalid_header.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertFalse($importer->validateHeader($header));
    }

    public function test_fails_on_missing_email()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/missing_email.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEquals('Email address: The selected email address is invalid.', $importer->getLastError());
    }

    public function test_fails_on_big_donation()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/donation_too_big.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        User::factory()->create([
            'email' => 'donor@empower.local',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEquals('Donation amount: The donation amount must be less than or equal 1000000.', $importer->getLastError());
    }

    public function test_fails_on_invalid_date()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/invalid_date.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        User::factory()->create([
            'email' => 'donor@empower.local',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEquals('Donation date: The donation date is not a valid date.', $importer->getLastError());
    }

    public function test_succeeds_on_missing_retailer()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/other_retailer.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => 'Joe\'s N-R-G',
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEmpty($importer->getLastError());
    }

    public function test_succeeds_when_matching_other_retailer()
    {
        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Other - Acme Power",ABC123
CSV;
        $csv = Reader::createFromString($contents);
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => 'Acme Power',
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }

        $this->assertEmpty($importer->getLastError());
    }

    public function test_succeeds_when_matching_other_retailer_with_capitalised_headers()
    {
        $contents = <<<CSV
Donation Date,Donation Amount,Email Address,ICP,Retailer,Account Number
2024-06-29,42.00,donor@empower.local,12345678,"Other - Acme Power",ABC123
CSV;
        $csv = Reader::createFromString($contents);
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => 'Acme Power',
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }

        $this->assertEmpty($importer->getLastError());
    }

    public function test_fails_on_missing_donor()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/missing_donor.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        User::factory()->create([
            'email' => 'admin@empower.local',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEquals('User admin@empower.local is not a donor.', $importer->getLastError());
    }

    public function test_fails_on_missing_donation()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/missing_donation.csv');
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEquals('Could not find a matching donation.', $importer->getLastError());
    }

    public function test_succeeds_when_matching_donation_on_donor_alone()
    {
        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Flick",ABC123
CSV;
        $csv = Reader::createFromString($contents);
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $retailer = Retailer::factory()->create([
            'name' => 'Powershop',
        ]);
        Retailer::factory()->create([
            'name' => 'Flick',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => $retailer->name,
            'icp' => '87654321',
            'account_number' => 'BBB999',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }

        $this->assertEmpty($importer->getLastError());
    }

    public function test_succeeds_with_past_donation_on_different_day()
    {
        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Powershop",ABC123
CSV;
        $csv = Reader::createFromString($contents);
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $retailer = Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => $retailer->name,
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        PastDonation::factory()->create([
           'donation_id' => $donation->id,
           'date' => '2024-06-28',
           'amount' => '42.00',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }

        $this->assertEmpty($importer->getLastError());
    }

    public function test_fails_with_matching_past_donation()
    {
        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Powershop",ABC123
CSV;
        $csv = Reader::createFromString($contents);
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $retailer = Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => $retailer->name,
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        PastDonation::factory()->create([
            'donation_id' => $donation->id,
            'date' => '2024-06-29',
            'amount' => '42.00',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }

        $this->assertEquals('Past donation already recorded.', $importer->getLastError());
    }

    public function test_succeeds_with_past_donation_with_different_retailer()
    {
        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,,"Other - Acme Energy",
CSV;
        $csv = Reader::createFromString($contents);
        $importer = new DonationHistoryImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $retailer = Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $donor->assignRole(User::ROLE_DONOR);

        $donation = Donation::factory()->create([
            'user_id' => $donor->id,
            'retailer' => $retailer->name,
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        PastDonation::factory()->create([
            'donation_id' => $donation->id,
            'date' => '2024-06-29',
            'amount' => '42.00',
        ]);

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }

        $this->assertEmpty($importer->getLastError());
    }
}

