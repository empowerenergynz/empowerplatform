<?php declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Auth\Notifications\InviteUser;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Tests\Feature\FeatureTestCase;

class ImportDonorsTest extends FeatureTestCase
{
    public function test_it_flashes_success_with_new_donor()
    {
        Notification::fake();

        $user = User::factory()->create();
        $user->givePermissionTo(User::PERMISSION_CREATE_USERS);

        $this->actingAs($user);

        $contents = <<<CSV
first name,last name,email address,phone
Jim,Donor,jim.donor@empower.local,+64 27 123 4567
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('donors.csv', $contents);

        $response = $this->post('/users/import-donors', [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'success');

        $this->assertDatabaseHas('users', [
            'first_name' => 'Jim',
            'last_name' => 'Donor',
            'email' => 'jim.donor@empower.local',
            'phone_number' => '+64 27 123 4567',
        ]);

        Notification::assertTimesSent(1, InviteUser::class);
    }

    public function test_it_flashes_failure_with_invalid_file()
    {
        Notification::fake();

        $user = User::factory()->create();
        $user->givePermissionTo(User::PERMISSION_CREATE_USERS);

        $this->actingAs($user);

        $contents = <<<CSV
first name,surname,email address,phone
Jim,Donor,jim.donor@empower.local,+64 27 123 4567
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('donors.csv', $contents);

        $response = $this->post('/users/import-donors', [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'error');

        $this->assertDatabaseMissing('users', [
            'email' => 'jim.donor@empower.local',
        ]);

        Notification::assertTimesSent(0, InviteUser::class);
    }

    public function test_it_flashes_warning_with_no_data_file()
    {
        Notification::fake();

        $user = User::factory()->create();
        $user->givePermissionTo(User::PERMISSION_CREATE_USERS);

        $this->actingAs($user);

        $contents = <<<CSV
first name,last name,email address,phone
CSV;
        $uploadFile = UploadedFile::fake()->createWithContent('donors.csv', $contents);

        $response = $this->post('/users/import-donors', [
            'csv' => $uploadFile,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('messages.0', fn($flash) => $flash->status === 'warning');

        $this->assertDatabaseMissing('users', [
            'email' => 'jim.donor@empower.local',
        ]);

        Notification::assertTimesSent(0, InviteUser::class);
    }
}
