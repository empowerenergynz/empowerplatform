<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ImportPastDonationsRequest;
use App\Http\Requests\StorePastDonationRequest;
use App\Http\Resources\UserResource;
use App\Importers\DonationHistoryImporter;
use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\User;
use App\Queries\PastDonationsQuery;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use League\Csv\Exception as CsvException;
use League\Csv\Reader;

class PastDonationController extends Controller
{
    /**
     * List the AuthUser's past donations
     * @param User $user
     * @param Request $request
     * @param PastDonationsQuery $query
     * @return Response
     * @throws AuthorizationException
     */
    public function index(User $user, Request $request, PastDonationsQuery $query): Response
    {
        $this->authorize('viewOwn', PastDonation::class);

        $user = auth()->user();

        $pastDonationsPaginator = $query()
            ->whereHas('donation', fn($query) => $query->where('user_id', $user->id))
            ->with(['donation' => fn ($query) => $query->select('id', 'retailer')])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PastDonations/PastDonations', [
            'pastDonationsPaginator' => $pastDonationsPaginator,
        ]);
    }

    /**
     * List the selected User's past donations
     * @param User $user
     * @param Request $request
     * @param PastDonationsQuery $query
     * @return Response
     * @throws AuthorizationException
     */
    public function userHistory(User $user, Request $request, PastDonationsQuery $query): Response
    {
        $this->authorize('viewAny', User::class);
        $this->authorize('viewAny', PastDonation::class);
        $user->load(['roles']);

        $pastDonationsPaginator = $query()
            ->whereHas('donation', fn($query) => $query->where('user_id', $user->id))
            ->with(['donation' => fn ($query) => $query->select('id', 'retailer')])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PastDonations/UserPastDonations', [
            'user' => fn() => UserResource::make($user)->resolve(),
            'pastDonationsPaginator' => $pastDonationsPaginator,
            'currentTab' => 'history',
        ]);
    }

    /**
     * create PastDonation for the selected Donation
     * @param Donation $donation
     * @param StorePastDonationRequest $request
     * @throws AuthorizationException
     */
    public function storeFromDonation(Donation $donation, StorePastDonationRequest $request)
    {
        $this->authorize('createAny', PastDonation::class);

        $donation = PastDonation::create(array_merge(
            $request->validated(),
            ['donation_id' => $donation->id],
        ));

        $this->addFlashMessage(
            'success',
            'Donation recorded!',
            "A donation for $donation->icp has been recorded",
        );

        return Redirect::back();
    }

    public function importHistory(ImportPastDonationsRequest $request)
    {
        $this->authorize('createAny', PastDonation::class);

        $csvFile = $request->file('csv');
        $csv = Reader::createFromString($csvFile->get());

        $firstError = [];
        $importer = new DonationHistoryImporter();
        $pastDonationCount = 0;
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
                        $pastDonation = $importer->importRecord($record);

                        if ($pastDonation) {
                            $pastDonationCount++;
                        } else {
                            Log::error("Could not import donation for {$record['email address']}: {$importer->getLastError()}");
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
            $plural = Str::plural('donation', $pastDonationCount);
            $this->addFlashMessage(
                $pastDonationCount === 0 ? 'warning' : 'success',
                Str::ucfirst("{$plural} Imported"),
                "Imported {$pastDonationCount} past {$plural}",
            );
        }

        return Redirect::back();
    }
}
