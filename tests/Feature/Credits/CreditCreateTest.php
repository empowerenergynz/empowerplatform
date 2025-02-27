<?php declare(strict_types=1);

namespace Tests\Feature\Credits;

use App\Models\Region;
use App\Models\Retailer;
use Tests\Feature\FeatureTestCase;

class CreditCreateTest extends FeatureTestCase
{
    public function test_it_renders_the_form_to_create_a_credit()
    {
        Region::factory()->count(3)->create();
        Retailer::factory()->count(2)->create();
        $this->logInAsAgencyUser();

        $this->get('/credits/create')
            ->assertInertia(fn($page) => $page
                ->component('Credits/CreateCredit')
                ->has('regions', 3)
                ->has('retailers', 2)
                ->has('approvedAmounts', 3)
            );
    }

    public function test_it_renders_the_form_with_only_creditable_retailers()
    {
        Region::factory()->count(3)->create();

        Retailer::create([
            'id' => 1,
            'name' => 'Can Allocate Credit',
            'can_allocate_credit' => true,
        ]);

        Retailer::create([
            'id' => 2,
            'name' => 'Can\'t Allocate Credit',
            'can_allocate_credit' => false,
        ]);

        $this->logInAsAgencyUser();

        $this->get('/credits/create')
            ->assertInertia(fn($page) => $page
                ->component('Credits/CreateCredit')
                ->has('regions', 3)
                ->has('retailers', 1)
                ->where('retailers.0.name', 'Can Allocate Credit')
                ->has('approvedAmounts', 3)
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_credits()
    {
        $this->logInAsDonor();

        $this->get('/credits/create')
            ->assertStatus(403);
    }
}
