<?php declare(strict_types=1);

namespace Unit\Importers;

use App\Importers\DonorImporter;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use League\Csv\Exception as CsvException;
use League\Csv\Reader;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DonorImporterTest extends TestCase
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
        $importer = new DonorImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertFalse($importer->validateHeader($header));
    }

    public function test_completes_with_no_data_rows()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/no_data_rows.csv');
        $importer = new DonorImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        foreach ($csv->getRecords() as $record) {
            $importer->importRecord($record);
        }
        // No donors should have been imported
        $this->assertDatabaseCount('users', 0);
        $this->assertEmpty($importer->getLastError());
    }

    public function test_fails_on_empty_email()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/no_email.csv');
        $importer = new DonorImporter();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        foreach ($csv->getRecords() as $record) {
            $this->assertFalse($importer->validateRecord($record));
        }
        $this->assertEquals('Email address: The email address field is required.', $importer->getLastError());
    }

    public function test_fails_on_existing_donor()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/existing_donor.csv');
        $importer = new DonorImporter();

        User::factory()->create([
            'email' => 'donor@empower.local',
        ]);

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
        }
        $this->assertEquals('Email address: This email address has already been taken.', $importer->getLastError());
    }

    public function test_completes_with_new_donor()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/new_donor.csv');
        $importer = new DonorImporter();
        $donorRole = Role::where('name', User::ROLE_DONOR)->first();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $donorData = [];
        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
            $importer->importRecord($record);
            $donorData = $record;
        }

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseHas('users', [
            'first_name' => $donorData['first name'],
            'last_name' => $donorData['last name'],
            'email' => $donorData['email address'],
            'phone_number' => $donorData['phone'],
        ]);
        $this->assertEquals($donorRole->id, User::query()->get()[0]->roles[0]->id);

        $this->assertEmpty($importer->getLastError());
    }

    public function test_completes_with_new_donor_and_capitalised_headers()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/new_donor_cap.csv');
        $importer = new DonorImporter();
        $donorRole = Role::where('name', User::ROLE_DONOR)->first();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $donorData = [];
        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
            $importer->importRecord($record);
            $donorData = $record;
        }

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseHas('users', [
            'first_name' => $donorData['First Name'],
            'last_name' => $donorData['Last Name'],
            'email' => $donorData['Email Address'],
            'phone_number' => $donorData['Phone'],
        ]);
        $this->assertEquals($donorRole->id, User::query()->get()[0]->roles[0]->id);

        $this->assertEmpty($importer->getLastError());
    }

    public function test_completes_with_utf8_content()
    {
        $csv = Reader::createFromPath(dirname(__FILE__) . '/utf8_file.csv');
        $importer = new DonorImporter();
        $donorRole = Role::where('name', User::ROLE_DONOR)->first();

        $csv->setHeaderOffset(0);
        $header = $csv->getHeader();
        $this->assertTrue($importer->validateHeader($header));

        $donorData = [];
        foreach ($csv->getRecords() as $record) {
            $importer->validateRecord($record);
            $importer->importRecord($record);
            $donorData = $record;
        }

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseHas('users', [
            'first_name' => $donorData['first name'],
            'last_name' => $donorData['last name'],
            'email' => $donorData['email address'],
            'phone_number' => $donorData['phone'],
        ]);
        $this->assertEquals($donorRole->id, User::query()->get()[0]->roles[0]->id);

        $this->assertEmpty($importer->getLastError());
    }
}

