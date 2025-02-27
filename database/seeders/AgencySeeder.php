<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AgencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $agencies = Agency::factory()->times(3)->create([]);

        // create an Admin and User for each Agency
        $count = 0;
        foreach ($agencies as $agency) {
            $count++;
            $email = "admin@agency$count.ag";

            $agencyAdmin = User::whereEmail($email)->first();
            if (!$agencyAdmin) {
                /** @var User $agencyAdmin */
                $agencyAdmin = User::factory()->create([
                    'email' => $email,
                    'password' => Hash::make('password'),
                ]);
            }
            // Always assign this role and agency to the agency admin, even if they had been previously created
            $agencyAdmin->update([
                'agency_id' => $agency->id,
            ]);
            $agencyAdminRole = Role::whereName(User::ROLE_AGENCY_ADMIN)->first();
            $agencyAdmin->assignRole($agencyAdminRole);

            $email = "user@agency$count.ag";
            $agencyUser = User::whereEmail($email)->first();
            if (!$agencyUser) {
                /** @var User $agencyUser */
                $agencyUser = User::factory()->create([
                    'email' => $email,
                    'password' => Hash::make('password'),
                ]);
            }
            // Always assign this role and agency to the agency user, even if they had been previously created
            $agencyUser->update([
                'agency_id' => $agency->id,
            ]);
            $agencyUserRole = Role::whereName(User::ROLE_AGENCY_USER)->first();
            $agencyUser->assignRole($agencyUserRole);
        }
    }
}
