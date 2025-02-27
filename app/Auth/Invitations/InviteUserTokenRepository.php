<?php

declare(strict_types=1);

namespace App\Auth\Invitations;

use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Str;

class InviteUserTokenRepository
{
    public function create(User $user): string
    {
        $this->delete($user);

        $token = $this->createNewToken();

        UserInvitation::create([
            'user_id' => $user->id,
            'token' => $token,
        ]);

        return $token;
    }

    public function delete(User $user)
    {
        return UserInvitation::where('user_id', $user->id)->delete();
    }

    private function createNewToken(): string
    {
        return hash_hmac('sha256', Str::random(40), $this->getHashKey());
    }

    private function getHashKey(): string
    {
        $key = config('app.key');

        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        return $key;
    }
}
