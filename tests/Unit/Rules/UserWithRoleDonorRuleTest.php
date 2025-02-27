<?php declare(strict_types=1);

namespace Unit\Rules;

use App\Models\User;
use App\Rules\UserWithRoleDonorRule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserWithRoleDonorRuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_validates_donor_role()
    {
        $user = User::factory()->create();

        /** @var User $donor */
        $donor = User::factory()->create();
        $donor->assignRole(User::ROLE_DONOR);

        $rule = ['user_id' => [new UserWithRoleDonorRule()]];

        $this->assertFalse(validator(['user_id' => $user->id], $rule)->passes());
        $this->assertTrue(validator(['user_id' => $donor->id], $rule)->passes());
    }
}
