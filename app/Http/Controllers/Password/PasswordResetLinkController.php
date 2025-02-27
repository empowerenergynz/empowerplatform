<?php declare(strict_types=1);

namespace App\Http\Controllers\Password;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePasswordResetRequest;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function store(StorePasswordResetRequest $request)
    {
        Password::sendResetLink($request->only('email'));

        $this->addFlashMessage(
            'success',
            'Password reset',
            'If an account is associated with this email a reset password link will be sent',
        );

        return back();
    }
}
