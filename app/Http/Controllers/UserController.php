<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Auth\Invitations\InvitationBroker;
use App\Http\Requests\ImportDonorsRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Importers\DonorImporter;
use App\Models\Agency;
use App\Models\User;
use App\Queries\UsersQuery;
use App\ViewModels\CreateUserViewModel;
use App\ViewModels\EditUserViewModel;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use League\Csv\Reader;
use League\Csv\Exception as CsvException;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * @throws AuthorizationException
     */
    public function index(Request $request, UsersQuery $query): Response
    {
        $this->authorize('viewAny', User::class);

        $usersPaginator = $query()
            ->with('agency', fn($q) => $q->select('id', 'name'))
            ->paginate(30)
            ->withQueryString();
        $roles = Role::all(['id', 'name'])->sortBy('role_order');

        return Inertia::render('Users/Users', [
            'usersPaginator' => $usersPaginator,
            'roles' => $roles,
            'filter' => $request->get('filter'),
        ]);
    }

    /**
     * @throws AuthorizationException
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', User::class);

        $roles = Role::all()->sortBy('role_order');
        $loginUserRole = Auth::user()->getHighestRole();
        /** User can not update another user with higher roles. This belongs to AMG-432*/
        $disabledRoles = Role::all()->where('role_order', '<', $loginUserRole);
        $exclusiveRole = Role::where('name', User::ROLE_ADMIN)->first();
        $agencies = Agency::all(['id', 'name'])->sortBy('name');

        $viewModel = new CreateUserViewModel(
            $roles,
            $disabledRoles,
            $exclusiveRole,
            $agencies
        );

        return Inertia::render('Users/CreateUser', $viewModel);
    }

    /**
     * @throws AuthorizationException
     */
    public function store(InvitationBroker $invitationBroker, StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $newRoles = Role::all()
            ->whereIn('id', $request->validated()['roles'])
            ->pluck('role_order')
            ->toArray();
        $newRoles[] = 100;
        /** User can not create another user with higher roles. This belongs to AMG-432 */
        $loginUserRole = Auth::user()->getHighestRole();
        if ($loginUserRole > min($newRoles)) {
            $this->addFlashMessage(
                'error',
                'Create user error!',
                'Can not create user with these roles',
            );

            return redirect()->back();
        }

        $data = array_merge(Arr::except($request->validated(), 'roles'), ['password' => Hash::make(Str::random())]);
        /** @var User $user */
        $user = User::create($data);
        $user->assignRole($request->validated()['roles']);

        try {
            $invitationBroker->sendTo($user);
            $this->addFlashMessage(
                'success',
                'User created!',
                "Invitation sent to $user->email",
            );
        } catch (Exception $e) {
            report($e);
            $this->addFlashMessage(
                'error',
                'Mail not sent!',
                "An error occurred while sending invitation to $user->email",
            );
        }

        return Redirect::route('users.show', ['user' => $user->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @param Request $request
     * @return Response
     * @throws AuthorizationException
     */
    public function show(User $user, Request $request): Response
    {
        $this->authorize('viewAny', User::class);
        $user->load(['roles', 'agency']);

        return Inertia::render('Users/ShowUser', [
            'user' => fn() => UserResource::make($user)->resolve(),
            'currentTab' => 'details',
        ]);
    }

    public function updateInvitation(InvitationBroker $invitationBroker, User $user): RedirectResponse
    {
        $this->authorize('create', User::class);

        try {
            $invitationBroker->sendTo($user);
            $this->addFlashMessage(
                'success',
                'Invitation sent!',
                "Invitation resent to $user->email",
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
            $this->addFlashMessage(
                    'error',
                    'Mail not sent!',
                    "An error occurred while sending invitation to $user->email",
            );
        }

        return Redirect::route('users.index');
    }

    /**
     * @throws AuthorizationException
     */
    public function edit(User $user, Request $request): Response
    {
        $this->authorize('update', $user);

        $user->load(['roles']);

        $roles = Role::all()->sortBy('role_order');
        $loginUser = Auth::user();
        $loginUserRole = $loginUser->getHighestRole();
        /** User can not update another user with higher roles. This belongs to AMG-432*/
        $disabledRoles = Role::all()->where('role_order', '<', $loginUserRole);
        if ($loginUser->id === $user->id) {
            $disabledRoles = $roles;
        }
        $exclusiveRole = Role::where('name', User::ROLE_ADMIN)->first();
        $agencies = Agency::all(['id', 'name'])->sortBy('name');

        $viewModel = new EditUserViewModel($user, $roles, $disabledRoles, $exclusiveRole, $agencies);

        return Inertia::render('Users/CreateUser', $viewModel->toArray());
    }

    /**
     * @throws AuthorizationException
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        /** User can not modify their roles. This belongs to AMG-432 */
        $loginUser = Auth::user();
        if ($loginUser->id === $user->id) {
            $newRoles = array_map('intval', $request->roles);
            $oldRoles = $loginUser->roles()->pluck('id')->toArray();
            if (count(array_diff($newRoles, $oldRoles)) > 0) {
                $this->addFlashMessage(
                    'error',
                    'Update user error!',
                    'Can not update your roles',
                );

                return Redirect::route('users.show', ['user' => $user->id]);
            }
        }

        /** User can not update another user with higher roles. This belongs to AMG-432*/
        $loginUserRole = $loginUser->getHighestRole();
        $newRoles = Role::all()
            ->whereIn('id', $request->validated()['roles'])
            ->pluck('role_order')
            ->toArray();
        $newRoles[] = 100;
        if ($loginUserRole > min($newRoles)) {
            $this->addFlashMessage(
                'error',
                'Update user error!',
                'Can not update user with the role that higher your role',
            );

            return Redirect::route('users.show', ['user' => $user->id]);
        }

        /** User can not update information for higher role user */
        $userRole = $user->getHighestRole();
        if ($loginUserRole > $userRole) {
            $this->addFlashMessage(
                'error',
                'Update user error!',
                'Can not update this user',
            );

            return Redirect::route('users.show', ['user' => $user->id]);
        }

        $user->fill(Arr::except($request->validated(), 'roles'))
            ->save();
        $user->syncRoles($request->validated()['roles']);
        $this->addFlashMessage(
            'success',
            'User updated!',
            "$user->email has been updated",
        );

        return Redirect::route('users.show', ['user' => $user->id]);

    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $loginUserRole = Auth::user()->getHighestRole();
        $userRole = $user->getHighestRole();
        if ($loginUserRole <= $userRole) {
            $user->delete();

            $this->addFlashMessage(
                'success',
                'User archived!',
                "$user->email has been archived",
            );
        } else {
            $this->addFlashMessage(
                'error',
                'Archive user error!',
                'Can not archived this user',
            );
        }

        return Redirect::route('users.index');
    }

    /**
     * @throws AuthorizationException
     */
    public function restore(User $user): RedirectResponse
    {
        $this->authorize('restore', $user);

        $loginUserRole = Auth::user()->getHighestRole();
        $userRole = $user->getHighestRole();
        if ($loginUserRole <= $userRole) {
            $user->restore();

            $this->addFlashMessage(
                'success',
                'User restored!',
                "$user->email has been restored",
            );
        } else {
            $this->addFlashMessage(
                'error',
                'Restore user error!',
                'Can not restored this user',
            );
        }

        return Redirect::route('users.edit', ['user' => $user]);
    }

    public function importDonors(InvitationBroker $invitationBroker, ImportDonorsRequest $request)
    {
        $this->authorize('create', User::class);

        $csvFile = $request->file('csv');
        $csv = Reader::createFromString($csvFile->get());

        $firstError = [];
        $importer = new DonorImporter();
        $donorCount = 0;
        try {
            $csv->setHeaderOffset(0);
            $header = $csv->getHeader();

            if ($importer->validateHeader($header)) {
                // Validation Pass
                $validationPassed = true;
                foreach ($csv->getRecords() as $offset => $record) {
                    if (!$importer->validateRecord($record)) {
                        $firstError = [
                            'line' => $offset + 1,
                            'message' => $importer->getLastError(),
                        ];
                        $validationPassed = false;
                        break;
                    }
                }
                // Import Pass
                if ($validationPassed) {
                    foreach ($csv->getRecords() as $record) {
                        $donor = $importer->importRecord($record);

                        if ($donor) {
                            $donorCount++;
                            try {
                                $invitationBroker->sendTo($donor);
                            } catch (Exception $e) {
                                report($e);
                            }
                        } else {
                            Log::error("Could not import donor {$record['email address']}: {$importer->getLastError()}");
                        }
                    }
                }
            } else {
                $firstError = [
                    'message' => 'Valid header not found.'
                ];
            }
        } catch (CsvException $exception) {
            $firstError = [
                'message' => 'Error parsing file'
            ];
        }

        if ($firstError) {
            $title = array_key_exists('line', $firstError) ? "Error on line {$firstError['line']}" : "Error in file";
            $this->addFlashMessage(
                'error',
                $title,
                $firstError['message'],
            );
        } else {
            $plural = Str::plural('donor', $donorCount);
            $this->addFlashMessage(
                $donorCount === 0 ? 'warning' : 'success',
                Str::ucfirst("{$plural} Imported"),
                "Imported {$donorCount} {$plural}",
            );
        }

        return Redirect::back();
    }
}
