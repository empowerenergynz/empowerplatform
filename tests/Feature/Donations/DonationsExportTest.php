<?php

declare(strict_types=1);

namespace Tests\Feature\Donations;

use App\Models\Donation;
use Carbon\CarbonImmutable;
use Database\Seeders\DonationSeeder;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class DonationsExportTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->seed(DonationSeeder::class);
        $this->donation = Donation::all()->first();
        $this->donor = $this->donation->user;
    }

    public function test_it_renders_a_403_when_donor_attempts_export()
    {
        $this->logInAsDonor();

        $this->get(route('donations.export'))
            ->assertStatus(403);
    }

    public function test_it_renders_a_403_when_agency_admin_attempts_export()
    {
        $this->logInAsAgencyAdmin();

        $this->get(route('donations.export'))
            ->assertStatus(403);
    }

    public function test_it_downloads_file_when_requested()
    {
        $now = CarbonImmutable::now();
        $timestamp = $now->format('Y-m-d');
        CarbonImmutable::setTestNow($now);

        $this->logInAsAdmin();

        $this->get(route('donations.export'))
            ->assertDownload("donation-export-{$timestamp}.csv");
    }

    public function test_it_renders_a_404_when_no_donations()
    {
        Donation::query()->delete();

        $this->logInAsAdmin();

        $this->get(route('donations.export'))
            ->assertStatus(404);
    }
}
