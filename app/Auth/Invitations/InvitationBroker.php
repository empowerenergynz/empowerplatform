<?php

declare(strict_types=1);

namespace App\Auth\Invitations;

use App\Models\User;

class InvitationBroker
{
    public function __construct(private InviteUserTokenRepository $tokenRepository)
    {
    }

    public function sendTo(User $user)
    {
        $token = $this->tokenRepository->create($user);

        $user->sendInvitationNotification($token);
    }
}
