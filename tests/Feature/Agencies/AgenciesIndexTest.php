<?php declare(strict_types=1);

namespace Tests\Feature\Agencies;

use App\Models\Agency;
use Inertia\Testing\AssertableInertia;
use Tests\Feature\FeatureTestCase;

class AgenciesIndexTest extends FeatureTestCase
{
    public function test_it_renders_the_agencies_screen()
    {
        $this->logInAsAdmin();

        Agency::factory()->count(3)->create();

        $this->get('/agencies')
            ->assertInertia(fn($page) => $page
                ->component('Agencies/Agencies')
                ->has('agenciesPaginator', fn(AssertableInertia $page) => $page
                    ->has('total')
                    ->where('per_page', 2000)
                    ->has('data', 3)
                    ->etc()
            ))
        ;
    }

    public function test_it_redirects_the_user_when_he_does_not_have_permission_to_view_agencies()
    {
        $this->logInAsDonor();

        $this->get('/agencies')
            ->assertStatus(403);
    }
}
