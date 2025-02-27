<?php

declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Models\Agency;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Tests\Feature\FeatureTestCase;

class UsersShowTest extends FeatureTestCase
{
    private User $user;

    public function setUp(): void
    {
        parent::setUp();

        $this->seed(UserSeeder::class);
        $this->user = User::factory()->create();
    }

    public function test_it_renders_the_screen_to_show_individual_user()
    {
        $this->logInAsAdmin();

        $this->get(route('users.show', ['user' => $this->user]))
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Users/ShowUser')
                ->where('currentTab', 'details')
                ->has('user', fn($page) => $page
                    ->where('id', $this->user->id)
                    ->where('first_name', $this->user->first_name)
                    ->where('last_name', $this->user->last_name)
                    ->where('email', $this->user->email)
                    ->where('phone_number', $this->user->phone_number)
                    ->where('deleted_at', $this->user->deleted_at)
                    ->where('agency_id', null)
                    ->where('agency', null)
                    ->etc()
                )
            );
    }

    public function test_it_renders_the_screen_to_show_agency_user()
    {
        $this->logInAsAdmin();
        $agency = Agency::factory()->create();
        $user = User::factory()->create(['agency_id' => $agency->id]);

        $this->get(route('users.show', ['user' => $user]))
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Users/ShowUser')
                ->where('currentTab', 'details')
                ->has('user', fn($page) => $page
                    ->where('id', $user->id)
                    ->where('first_name', $user->first_name)
                    ->where('last_name', $user->last_name)
                    ->where('email', $user->email)
                    ->where('phone_number', $user->phone_number)
                    ->where('deleted_at', $user->deleted_at)
                    ->where('agency_id', $agency->id)
                    ->where('agency.name', $agency->name)
                    ->etc()
                )
            );
    }

    public function test_it_renders_the_screen_to_show_archived_user()
    {
        $this->logInAsAdmin();
        $user = User::factory()->create();
        $user->delete();

        $this->get(route('users.show', ['user' => $user]))
            ->assertStatus(200)
            ->assertInertia(fn($page) => $page
                ->component('Users/ShowUser')
                ->where('currentTab', 'details')
                ->has('user', fn($page) => $page
                    ->where('id', $user->id)
                    ->where('first_name', $user->first_name)
                    ->where('last_name', $user->last_name)
                    ->where('email', $user->email)
                    ->where('phone_number', $user->phone_number)
                    ->where('deleted_at', $user->deleted_at->format('Y-m-d\TH:i:s.u\Z'))
                    ->etc()
                )
            );
    }

    public function test_it_renders_a_403_for_a_user_with_donor_role()
    {
        $this->logInAsDonor();

        $this->get(route('users.show', ['user' => $this->user]))
            ->assertStatus(403);
    }
}
