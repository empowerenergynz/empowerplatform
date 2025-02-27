<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $usersRoles = [
            'donor@empower.local' => User::ROLE_DONOR,
            'admin@empower.local' => User::ROLE_ADMIN,
            'super-admin@empower.local' => User::ROLE_SUPER_ADMIN,
            'donor2@empower.local' => User::ROLE_DONOR,
        ];

        foreach ($usersRoles as $email => $roleName) {
            if (!User::whereEmail($email)->first()) {
                $role = Role::whereName($roleName)->first();

                /** @var User $user */
                $user = User::factory()->create([
                    'email' => $email,
                    'password' => Hash::make('password'),
                ]);

                $user->assignRole($role);
            }
        }
    }
}
