<?php declare(strict_types=1);

namespace App\Listeners;

use Carbon\Carbon;
use Illuminate\Auth\Events\Login;

class UserLoginAt
{
    /**
     * Handle the event.
     *
     * @param \Illuminate\Auth\Events\Login $event
     * @return void
     */
    public function handle(Login $event): void
    {
        $event->user->update([
            'last_login_at' => Carbon::now(),
        ]);
    }
}
