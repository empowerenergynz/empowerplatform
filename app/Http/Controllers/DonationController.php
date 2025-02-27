<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Http\Resources\UserResource;
use App\Models\Donation;
use App\Models\Retailer;
use App\Models\User;
use App\Queries\DonationsQuery;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use League\Csv\Writer;
use Illuminate\Http\Response as HttpResponse;

class DonationController extends Controller
{
    /**
     * @throws AuthorizationException
     */
    public function index(Request $request, DonationsQuery $query): Response
    {
        $this->authorize('viewAny', Donation::class);

        // if the user can view all users (Admins?) then provide the Donor details
        // otherwise limit the query to the Donor's own Donations
        $user = Auth::user();
        $newQuery = $user->hasPermissionTo(User::PERMISSION_VIEW_USERS)
            ? $query()->with('user')
            : $query()->where('user_id', $user->id);

        $donationsPaginator = $newQuery
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Donations/Donations', [
            'donationsPaginator' => $donationsPaginator,
            'filter' => $request->get('filter'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('createAny', Donation::class);

        $props = [
            'retailers' => array_map(fn ($retailer) => $retailer['name'], Retailer::getDonatableCached()),
        ];

        // if the user can view all users (Admins?) then provide the Donors to select from
        $user = Auth::user();
        if ($user->hasPermissionTo(User::PERMISSION_VIEW_USERS)) {
            $donors = User::Role(User::ROLE_DONOR)->get(['id', 'first_name', 'last_name']);
            $props['donors'] = UserResource::collection($donors);
        };

        return Inertia::render('Donations/CreateDonation', $props);
    }

    public function store(StoreDonationRequest $request): RedirectResponse
    {
        $this->authorize('create', [Donation::class, $request]);

        /** @var Donation $donation */
        $donation = Donation::create($request->validated());

        $this->addFlashMessage(
            'success',
            'Donation created!',
            "Donation $donation->icp has been created",
        );

        return Redirect::route('donations.index');
    }

    public function show(Donation $donation): Response
    {
        $this->authorize('view', $donation);

        // if the user can view all users (Admins?) then provide the Donor's details
        if (Auth::user()->hasPermissionTo(User::PERMISSION_VIEW_USERS)) {
            $donation->load('user');
        }

        return Inertia::render('Donations/ShowDonation', [
            'donation' => DonationResource::make($donation)->resolve(),
        ]);
    }

    public function edit(Donation $donation): Response
    {
        $this->authorize('update', $donation);

        $props = [
            'donation' => DonationResource::make($donation)->resolve(),
            'retailers' => array_map(fn ($retailer) => $retailer['name'], Retailer::getDonatableCached()),
        ];

        // if the user can view all users (Admins?) then provide the Donors to select from
        $user = Auth::user();
        if ($user->hasPermissionTo(User::PERMISSION_VIEW_USERS)) {
            $donors = User::Role(User::ROLE_DONOR)->get(['id', 'first_name', 'last_name']);
            $props['donors'] = UserResource::collection($donors);
        };

        return Inertia::render('Donations/CreateDonation', $props);
    }

    public function update(StoreDonationRequest $request, Donation $donation): RedirectResponse
    {
        $this->authorize('update', $donation);

        $donation->fill($request->validated())
            ->save();

        $this->addFlashMessage(
            'success',
            'Donation updated!',
            "Donation $donation->icp has been updated",
        );

        return Redirect::route('donations.show', ['donation' => $donation]);
    }

    public function export()
    {
        $this->authorize('viewAny', Donation::class);

        /** @var User $user */
        $user = Auth::user();

        if ($user->hasPermissionTo(Donation::PERMISSION_EXPORT_DONATIONS)) {
            $timestamp = CarbonImmutable::now()->format('Y-m-d');

            $headers = [
                'Donor Name',
                'EMAIL ADDRESS',
                'ICP',
                'Retailer',
                'Account Number',
                'Address',
                'Donation Amount',
                'Donation %',
                'Buy-Back Rate',
                'Status',
            ];
            $allDonations = Donation::query()
                ->with('user')
                ->orderBy('is_active', 'desc')
                ->orderBy('updated_at', 'asc')
                ->get()->map(fn ($record) => $record->toArray());

            if ($allDonations->count() > 0) {
                $csv = Writer::createFromFileObject(new \SplTempFileObject());
                $csv->insertOne($headers);
                foreach ($allDonations as $donation) {
                    $values = [
                        $donation['user']['first_name'] . ' ' . $donation['user']['last_name'],
                        $donation['user']['email'],
                        $donation['icp'],
                        $donation['retailer'],
                        $donation['account_number'],
                        $donation['address'],
                        $donation['is_dollar'] ? $donation['amount'] : '',
                        $donation['is_dollar'] ? '' : $donation['amount'],
                        $donation['is_dollar'] ? '' : $donation['buyback_rate'],
                        $donation['is_active'] ? 'Active' : 'Paused',
                    ];
                    $csv->insertOne($values);
                }

                // Add BOM to start of text, to indicate to reader that content is in UTF-8 encoding.
                $bom = "\xEF\xBB\xBF";
                return new HttpResponse($bom . $csv->toString(), 200, [
                    'Content-Type' => 'text/csv; charset=UTF-8',
                    'Content-Disposition' => "attachment; filename=\"donation-export-${timestamp}.csv\"",
                ]);
            }
            // No donations found
            abort(404);
        }
        // Not an admin
        abort(403);
    }

    public function destroy(Donation $donation)
    {
        //
    }
}
