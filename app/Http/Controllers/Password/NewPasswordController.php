<?php declare(strict_types=1);

namespace App\Http\Controllers\Password;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewPasswordController extends Controller
{
    public function create(Request $request)
    {
        $user = User::where('email', $request->email)->firstOrFail();
        $tokenExists = Password::tokenExists($user, $request->route('token'));
        abort_if(!$tokenExists, 419);

        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function store(StoreNewPasswordRequest $request): RedirectResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            $this->addFlashMessage(
                'success',
                'Password reset',
                'Your password has been updated',
            );

            return redirect()->route('login');
        }

        $this->addFlashMessage(
            'error',
            'Error',
            'An error occurred while resetting your password',
        );

        return back();
    }
}
