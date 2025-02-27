<?php

declare(strict_types=1);

namespace Tests\Unit\Queries;

use App\Models\Agency;
use App\Models\User;
use App\Models\UserInvitation;
use App\Queries\UsersQuery;
use Illuminate\Http\Request;

class UsersQueryTest extends QueryTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $agencyF = Agency::factory()->create(['name' => 'foo agency']);
        $this->userA = User::factory()->create([
            'first_name' => 'Zoey',
            'email' => 'zoey@empower.local',
            'agency_id' => $agencyF->id,
        ]);
        $this->userA->assignRole(User::ROLE_DONOR);

        $agencyB = Agency::factory()->create(['name' => 'bar agency']);
        $this->userB = User::factory()->create([
            'first_name' => 'Ashton',
            'email' => 'ashton@empower.local',
            'agency_id' => $agencyB->id,
        ]);
        $this->userB->assignRole(User::ROLE_DONOR);

        $this->userC = User::factory()->create([
            'first_name' => 'Ashley',
            'email' => 'ashley@empower.local',
            'agency_id' => $agencyF->id,
        ]);
        $this->userC->assignRole(User::ROLE_ADMIN);

        $this->userD = User::factory()->create([
            'first_name' => 'Donald',
            'email' => 'donald_washington@empower.local',
        ]);
        $this->userD->assignRole(User::ROLE_SUPER_ADMIN);
    }

        public function test_that_it_returns_users_ordered_by_name_by_default()
    {
        $request = new Request();
        $request->setUserResolver(fn () => $this->userA);
        $query = new UsersQuery($request);
        $users = $query()->get();

        $this->assertCount(4, $users);
        $this->assertEquals($this->userC->name, $users->first()->name);
        $this->assertEquals($this->userB->name, $users->get(1)->name);
        $this->assertEquals($this->userD->name, $users->get(2)->name);
        $this->assertEquals($this->userA->name, $users->last()->name);
    }

    public function test_that_it_allows_the_search_filter()
    {
        $request = new Request(['filter' => ['search' => 'ash']]);
        $request->setUserResolver(fn () => $this->userA);
        $query = new UsersQuery($request);
        $users = $query()->get();

        $this->assertCount(3, $users);

        $this->assertEquals($this->userC->name, $users->first()->name);
        $this->assertEquals($this->userB->name, $users->get(1)->name);
        $this->assertEquals($this->userD->name, $users->last()->name);
    }

    public function test_that_it_allows_the_search_filter_by_agency()
    {
        $request = new Request(['filter' => ['search' => 'oo a']]);
        $request->setUserResolver(fn () => $this->userA);
        $query = new UsersQuery($request);
        $users = $query()->get();

        $this->assertCount(2, $users);

        // these two are connected to the "Foo Agency"
        $this->assertEquals($this->userC->name, $users->first()->name);
        $this->assertEquals($this->userA->name, $users->last()->name);
    }

    public function test_that_it_allows_the_role_filter()
    {
        $request = new Request(['filter' => ['role' => [3] ]]);
        $request->setUserResolver(fn () => $this->userA);
        $query = new UsersQuery($request);
        $users = $query()->get();

        $this->assertCount(2, $users);
    }

    public function test_that_it_allows_the_status_filter()
    {
        UserInvitation::create([
            'user_id' => $this->userA->id,
            'token' => 'cypress_invitation_token',
        ]);
        UserInvitation::create([
            'user_id' => $this->userC->id,
            'token' => 'cypress_invitation_token',
        ]);

        $request = new Request(['filter' => ['status' => ['active' ]]]);
        $request->setUserResolver(fn () => $this->userA);
        $query = new UsersQuery($request);
        $users = $query()->get();

        $this->assertCount(2, $users);
        $this->assertEquals($this->userB->name, $users->first()->name);
        $this->assertEquals($this->userD->name, $users->last()->name);
    }
}
