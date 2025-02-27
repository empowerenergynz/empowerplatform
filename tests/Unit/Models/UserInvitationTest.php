<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\UserInvitation;
use Carbon\Carbon;
use Tests\TestCase;

class UserInvitationTest extends TestCase
{
    public function test_it_renders_true_if_expired()
    {
        /** @var UserInvitation $token */
        $invitation = UserInvitation::make([
            'created_at' => Carbon::create(2021, 10, 8),
        ]);

        $this->assertTrue($invitation->isExpired());
    }

    public function test_it_renders_false_if_not_expired()
    {
        $date = Carbon::create(2021, 10, 8);
        Carbon::setTestNow($date);

        /** @var UserInvitation $token */
        $invitation = UserInvitation::make([
            'created_at' => Carbon::create(2021, 10, 8),
        ]);

        $this->assertFalse($invitation->isExpired());
    }
}
