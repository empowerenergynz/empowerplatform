<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\ViewModels\EditProfileViewModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        $user = auth()->user();
        $user->load(['roles']);

        $roles = Role::all();

        $viewModel = new EditProfileViewModel($user, $roles);

        return Inertia::render('Profile/EditProfile', $viewModel->toArray());
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = auth()->user();

        $user->fill($request->validated())
            ->save();

        $this->addFlashMessage(
            'success',
            'Profile updated!',
            'Your profile has been updated',
        );

        return Redirect::route('profile.edit');
    }
}
