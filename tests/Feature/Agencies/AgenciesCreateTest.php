<?php declare(strict_types=1);

namespace Tests\Feature\Agencies;

use App\Models\Region;
use Tests\Feature\FeatureTestCase;

class AgenciesCreateTest extends FeatureTestCase
{
    public function test_it_renders_the_form_to_create_an_agency()
    {
        Region::factory()->count(3)->create();
        $this->logInAsAdmin();

        $this->get('/agencies/create')
            ->assertInertia(fn($page) => $page
                ->component('Agencies/CreateAgency')
                ->has('regions', 3)
            );
    }

    public function test_it_renders_a_403_when_users_do_not_have_permission_to_create_agencies()
    {
        $this->logInAsDonor();

        $this->get('/agencies/create')
            ->assertStatus(403);
    }
}
