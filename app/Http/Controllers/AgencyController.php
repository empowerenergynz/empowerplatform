<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreAgencyRequest;
use App\Http\Requests\UpdateAgencyRequest;
use App\Models\Agency;
use App\Models\Region;
use App\Models\User;
use App\Queries\AgenciesQuery;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AgencyController extends Controller
{
    /**
     * @throws AuthorizationException
     */
    public function index(Request $request, AgenciesQuery $query): Response
    {
        $this->authorize('view', Agency::class);

        $paginator = $query()
            ->with(['region', 'district'])
            ->paginate(2000) // show all, for now
            ->withQueryString();

        return Inertia::render('Agencies/Agencies', [
            'agenciesPaginator' => $paginator,
            'filter' => $request->get('filter'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Agency::class);

        return Inertia::render('Agencies/CreateAgency', [
            'regions' => Region::getAllCached(),
        ]);
    }

    public function store(StoreAgencyRequest $request): RedirectResponse
    {
        $this->authorize('create', [Agency::class, $request]);

        /** @var Agency $agency */
        $agency = Agency::create($request->validated());

        $this->addFlashMessage(
            'success',
            'Agency created!',
            "Agency $agency->name has been created",
        );

        return Redirect::route('agencies.index');
    }

    public function show(Agency $agency): Response
    {
        $this->authorize('view', $agency);

        return Inertia::render('Agencies/ShowAgency', [
            'agency' => $agency->load(['region', 'district']),
            'liveBalance' => $agency->calculateCurrentBalance(),
        ]);
    }

    public function showMyBalance(): Response
    {
        $this->authorize('viewOwnBalance', Agency::class);

        /** @var User $authUser */
        $authUser = Auth::user();
        $liveBalance = $authUser->agency->calculateCurrentBalance();

        return Inertia::render('Agencies/ShowAgencyBalance', [
            'liveBalance' => $liveBalance,
        ]);
    }

    public function edit(Agency $agency): Response
    {
        $this->authorize('update', $agency);

        return Inertia::render('Agencies/CreateAgency', [
            'agency' => $agency,
            'regions' => Region::getAllCached(),
            'liveBalance' => $agency->calculateCurrentBalance(),
        ]);
    }

    public function update(UpdateAgencyRequest $request, Agency $agency): RedirectResponse
    {
        $this->authorize('update', $agency);

        $agency->fill($request->validated())
            ->save();

        $this->addFlashMessage(
            'success',
            'Agency updated!',
            "Agency $agency->name has been updated",
        );

        return Redirect::route('agencies.show', ['agency' => $agency]);
    }

    public function destroy(Agency $agency)
    {
        //
    }
}
