<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class CypressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->call(RegionSeeder::class);
        $this->call(RetailerSeeder::class);

        $usersRoles = [
            'cypress-donor@empower.local' => User::ROLE_DONOR,
            'cypress-admin@empower.local' => User::ROLE_ADMIN,
            'cypress-super-admin@empower.local' => User::ROLE_SUPER_ADMIN,
            'cypress-user-to-edit@empower.local' => User::ROLE_DONOR,
            'cypress-reset-password@empower.local' => User::ROLE_DONOR,
            'cypress-agency-admin@empower.local' => User::ROLE_AGENCY_ADMIN,
            'cypress-agency-user@empower.local' => User::ROLE_AGENCY_USER,
        ];

        $agency = Agency::factory()->create(['name' => 'Cypress Agency', 'balance' => 10000]);

        $users = [];

        foreach ($usersRoles as $email => $roleName) {
            if (!User::whereEmail($email)->first()) {
                $role = Role::whereName($roleName)->first();

                $userData = [
                    'first_name' => 'Cypress',
                    'last_name' => Str::ucfirst(Str::between($email, 'cypress-', '@empower.local')),
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'agency_id' => str_starts_with($roleName, 'agency') ? $agency->id : null,
                ];
                /** @var User $user */
                $user = User::create($userData);
                $user->assignRole($role);
                $users[] = $user;
            }
        }

        $invitedDonor = User::factory()->create([
            'email' => 'invited_donor@empower.local',
            'first_name' => 'Invited',
            'last_name' => 'User',
            'password' => Hash::make('password'),
        ]);
        $invitedDonor->assignRole(User::ROLE_DONOR);

        UserInvitation::create([
            'user_id' => $invitedDonor->id,
            'token' => 'cypress_invitation_token',
        ]);

        $resendInviteUser = User::factory()->create([
            'email' => 'resend_invite_user@empower.local',
            'first_name' => 'Resend Invite',
            'last_name' => 'User',
            'password' => Hash::make('password'),
        ]);
        $resendInviteUser->assignRole(User::ROLE_DONOR);

        UserInvitation::create([
            'user_id' => $resendInviteUser->id,
            'token' => 'cypress_resend_invite_token',
        ]);

        DB::table('password_resets')->insert([
            'email' => 'cypress-reset-password@empower.local',
            'token' => Hash::make('cypress_reset_password_token'),
            'created_at' => now(),
        ]);

        $donations = Donation::factory()
            ->count(3)
            ->sequence(fn ($sequence) => [
                'icp' => "cypress-donation-{$sequence->index}",
                'address' => "Donation Address {$sequence->index}",
                'gps_coordinates' => "3{$sequence->index},80",
                'account_number' => "123456{$sequence->index}",
                'user_id' => $sequence->index == 1 ? $invitedDonor->id : $users[0]->id,
            ])
            ->create();

        PastDonation::factory()->count(3)->create([
            'icp' => $donations[0]->icp,
            'account_number' => $donations[0]->account_number,
            'donation_id' => $donations[0]->id,
        ]);

        PastDonation::factory()->create([
            'icp' => $donations[1]->icp,
            'account_number' => $donations[1]->account_number,
            'donation_id' => $donations[1]->id,
        ]);

        // Index the seeded records for searching
        // Artisan::call('scout:import');
    }
}
