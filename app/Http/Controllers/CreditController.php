<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\CreditStatus;
use App\Http\Requests\StoreCreditRequest;
use App\Http\Requests\UpdateManyCreditStatusRequest;
use App\Models\Credit;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use App\Notifications\CreditCreated;
use App\Queries\CreditsQuery;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CreditController extends Controller
{
    public function index(Request $request, CreditsQuery $query): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $this->authorize('viewAllOrAgency', Credit::class);

        $creditQuery = $query();
        if ($user->isAgencyAdmin()) {
            $creditQuery = $creditQuery->where('agency_id', $user->agency->id);
        }

        $creditsPaginator = $creditQuery
            // send full retailer info for generating the CSV export
            ->with('retailer')
            // we only need the names of these
            ->with('agency', fn($q) => $q->select('id', 'name'))
            ->with('region', fn($q) => $q->select('id', 'name'))
            ->with('district', fn($q) => $q->select('id', 'name'))
            ->paginate(200)
            ->withQueryString();

        return Inertia::render('Credits/Credits', [
            'creditsPaginator' => $creditsPaginator,
            'filter' => $request->get('filter'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Credit::class);

        /** @var User $user */
        $user = Auth::user();
        $liveBalance = null;
        if ($user->agency) {
            $liveBalance = $user->agency->calculateCurrentBalance();
        }

        return Inertia::render('Credits/CreateCredit', [
            'regions' => Region::getAllCached(),
            'retailers' => Retailer::getCreditableCached(),
            'approvedAmounts' => StoreCreditRequest::APPROVED_AMOUNTS,
            'balance' => $liveBalance,
        ]);
    }

    public function store(StoreCreditRequest $request): RedirectResponse
    {
        $this->authorize('create', [Credit::class, $request]);

        /** @var User $user */
        $user = Auth::user();

        /** @var Credit $credit */
        $data = array_merge($request->validated(), [
            'status' => CreditStatus::Requested,
            'created_by_id' => $user->id,
            'agency_id' => $user->agency_id,
        ]);
        $credit = Credit::create($data);

        // Notify admins that Credit Request has been created
        $admins = User::Role(User::ROLE_ADMIN)->get();
        Notification::send($admins, new CreditCreated($credit));

        $this->addFlashMessage(
            'success',
            'Credit created!',
            "Credit for $credit->name has been created",
        );

        return Redirect::route('credits.create');
    }

    public function updateManyStatus(UpdateManyCreditStatusRequest $request): RedirectResponse
    {
        $this->authorize('updateAll', [Credit::class, $request]);

        /** @var User $authUser */
        $authUser = Auth::user();

        $data = $request->validated();

        /* @var Credit[] $credits */
        $credits = Credit::all()->whereIn('id', $data['ids']);

        // do these validations here rather than in the Request validator so we don't have to hit the db multiple times.
        if ($credits->count() != count($data['ids'])) {
            throw ValidationException::withMessages([
                'ids' => 'Credits not found',
            ]);
        }
        $currentStatus = $credits->first()->status;
        foreach ($credits as $credit) {
            if ($credit->status != $currentStatus) {
                throw ValidationException::withMessages([
                    'ids' => 'Not all credits are in the same current status',
                ]);
            }
        }

        // all valid - update and save them all
        // make sure they all share the exact same exported_date
        $now = Carbon::now();
        $newStatus = $data['status'];
        foreach ($credits as $credit) {
            $credit->setStatusAndSave($newStatus, $now, $authUser->id, $data['admin_notes'] ?? null);
        }

        $this->addFlashMessage(
            'success',
            'Credits updated!',
            "Credit statuses have been updated",
        );

        return Redirect::back();
    }
}
