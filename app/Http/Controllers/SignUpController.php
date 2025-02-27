<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Auth\Invitations\InviteUserTokenRepository;
use App\Http\Requests\SignUpRequest;
use App\Models\UserInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SignUpController extends Controller
{
    public function create(Request $request)
    {
        $invitation = $this->getInvitation($request);

        return Inertia::render('Auth/SignUp', [
            'user' => $invitation->user->only('id', 'name', 'email', 'phone_number'),
            'token' => $request->token,
        ]);
    }

    public function store(InviteUserTokenRepository $inviteUserTokenRepository, SignUpRequest $request)
    {
        $invitation = $this->getInvitation($request);

        $user = $invitation->user;
        $user->fill($request->getUserData());
        $user->save();

        $inviteUserTokenRepository->delete($user);

        $request->authenticate();

        return redirect(route('home'));
    }

    private function getInvitation(Request $request): UserInvitation | null
    {
        $invitation = UserInvitation::with('user')
            ->where('token', $request->token)
            ->firstOrFail();

        abort_if($invitation->isExpired(), 419);

        return $invitation;
    }
}
