<?php declare(strict_types=1);

namespace Feature\PastDonations;

use App\Models\Donation;
use App\Models\Retailer;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\UploadedFile;
use Tests\Feature\FeatureTestCase;

class ImportPastDonationsTest extends FeatureTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->donor = User::factory()->create([
            'email' => 'donor@empower.local',
        ]);
        $this->donor->assignRole(User::ROLE_DONOR);

        $this->retailer = Retailer::factory()->create([
            'name' => 'Powershop',
        ]);

        $this->donation = Donation::factory()->create([
            'user_id' => $this->donor->id,
            'retailer' => $this->retailer->name,
            'icp' => '12345678',
            'account_number' => 'ABC123',
        ]);

        $this->admin = User::factory()->create();
        $this->admin->assignRole(User::ROLE_ADMIN);
    }

    public function test_it_renders_a_403_for_a_user_with_donor_role()
    {
        $this->actingAs($this->donor);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Powershop",ABC123
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ])->assertStatus(403);
    }

    public function test_it_flashes_success_with_fully_matching_past_donation()
    {
        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Powershop",ABC123
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'success');

        $this->assertDatabaseHas('past_donations', [
            'date' => '2024-06-29',
            'amount' => '42.00',
            'retailer' => $this->retailer->name,
            'icp' => $this->donation->icp,
            'account_number' => $this->donation->account_number,
            'donation_id' => $this->donation->id,
        ]);
    }

    public function test_it_flashes_success_with_past_donation_matched_only_on_icp_and_account_number()
    {
        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,12345678,"Other - Acme Energy",ABC123
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'success');

        $this->assertDatabaseHas('past_donations', [
            'date' => '2024-06-29',
            'amount' => '42.00',
            'retailer' => 'Acme Energy',
            'icp' => $this->donation->icp,
            'account_number' => $this->donation->account_number,
            'donation_id' => $this->donation->id,
        ]);
    }

    public function test_it_flashes_success_with_past_donation_matched_only_on_retailer()
    {
        $meridian = Retailer::factory()->create([
            'name' => 'Meridian Energy',
        ]);
        $meridianDonation = Donation::factory()->create([
            'user_id' => $this->donor->id,
            'retailer' => $meridian->name,
            'icp' => '87654321',
            'account_number' => 'BBB999',
        ]);

        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,,"Meridian Energy",
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'success');

        $this->assertDatabaseHas('past_donations', [
            'date' => '2024-06-29',
            'amount' => '42.00',
            'retailer' => $meridianDonation->retailer,
            'icp' => $meridianDonation->icp,
            'account_number' => $meridianDonation->account_number,
            'donation_id' => $meridianDonation->id,
        ]);
    }

    public function test_it_flashes_success_with_past_donation_from_correct_donor()
    {
        $otherDonor = User::factory()->create([
            'email' => 'otherdonor@empower.local',
        ]);
        $otherDonor->assignRole(User::ROLE_DONOR);

        // Importer will match on Retailer only, so create a Donation for the
        // other Donor that would also match (if we weren't filtering by User)
        Donation::factory()->create([
            'user_id' => $otherDonor->id,
            'retailer' => $this->retailer->name,
            'icp' => '23456789',
            'account_number' => 'ABC124',
        ]);

        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,,"Powershop",
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'success');

        $this->assertDatabaseHas('past_donations', [
            'date' => '2024-06-29',
            'amount' => '42.00',
            'retailer' => $this->retailer->name,
            'icp' => $this->donation->icp,
            'account_number' => $this->donation->account_number,
            'donation_id' => $this->donation->id,
        ]);
    }

    public function test_it_flashes_success_with_past_donation_matched_only_on_donation()
    {
        // Test that we select the most recent matching Donation
        $this->donation->updated_at = CarbonImmutable::now()->subDay();
        $this->donation->save();

        $moreRecentDonation = Donation::factory()->create([
            'user_id' => $this->donor->id,
            'retailer' => $this->retailer->name,
            'icp' => '87654321',
            'account_number' => 'BBB999',
        ]);

        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-06-29,42.00,donor@empower.local,,"Other - Acme Energy",
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'success');

        $this->assertDatabaseHas('past_donations', [
            'date' => '2024-06-29',
            'amount' => '42.00',
            'retailer' => 'Acme Energy',
            'icp' => $moreRecentDonation->icp,
            'account_number' => $moreRecentDonation->account_number,
            'donation_id' => $moreRecentDonation->id,
        ]);
    }

    public function test_it_flashes_warning_with_no_data_file()
    {
        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('past-donations.csv', $contents);

        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'warning');

        $this->assertDatabaseCount('past_donations', 0);
    }

    public function test_it_flashes_failure_with_invalid_file()
    {
        $this->actingAs($this->admin);

        $contents = <<<CSV
donation date,donation amount,email address,icp,retailer,account number
2024-02-25,42.00,donor@empower.local,12345678,Powershop,ABC123
2024-02-28,42.00,donor@empower.local,12345678,Powershop,ABC123
2024-02-31,42.00,donor@empower.local,12345678,Powershop,ABC123
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('donors.csv', $contents);
        $response = $this->post(route('importDonationHistory'), [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'error');
        $errorContent = 'Donation date: The donation date is not a valid date.';
        $response->assertSessionHas('messages.0', fn($flash) => $flash->content === $errorContent);

        $this->assertDatabaseCount('past_donations', 0);
    }
}
