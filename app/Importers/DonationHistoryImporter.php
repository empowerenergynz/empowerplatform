<?php declare(strict_types=1);

namespace App\Importers;

use App\Models\Donation;
use App\Models\PastDonation;
use App\Models\Retailer;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DonationHistoryImporter
{
    use NormalisesRecords;

    private string $lastError = '';

    private array $validationRules = [
        'donation date' => ['required', 'date'],
        // 2. Validate amount and retailer
        //   a. If amount is over $1 million, then raise an error
        // no more than 2 decimal places
        "donation amount" => ['required', 'numeric', 'gt:0', 'lte:1000000', 'regex:/^\d+(\.\d{0,2})?$/'],
        // 1. Find the User with a matching email address
        //   a. If no User found, raise an error
        "email address" => ['required', 'email', 'max:255', 'iexists:users,email'],
        "icp" => ['string', 'max:255'],
        "retailer" => ['string', 'max:255'],
        "account number" => ['string', 'max:255'],
    ];

    private function headers(): array
    {
        return array_keys($this->validationRules);
    }

    public function validateHeader(array $header): bool
    {
        $lowerCaseHeaders = array_map('strtolower', $header);
        return $lowerCaseHeaders === $this->headers();
    }

    public function validateRecord(array $record): bool
    {
        $record = $this->normaliseRecord($record);
        // First, do basic validation of the data
        $validator = Validator::make($record, $this->validationRules);

        if (!$validator->passes()) {
            foreach ($validator->errors()->getMessages() as $field => $messages) {
                $formattedField = Str::ucfirst($field);
                $this->lastError = "{$formattedField}: {$messages[0]}";
            }
            return false;
        }

        // Next, validate that we can properly record this PastDonation against an existing Donation

        // 1. Find the User with a matching email address
        //   a. If no User found, raise an error
        /* @var ?User $user */
        $user = $this->donorForField($record['email address']);
        if (!$user) {
            $this->lastError = "User {$record['email address']} is not a donor.";
            return false;
        }

        // 2. Validate amount and retailer
        $retailer = $this->retailerNameForField($record['retailer']);
        //   c. Otherwise, if Retailer is specified, and doesn't match a retailer from the list, raise an error
        if ($retailer === null) {
            $this->lastError = "Retailer not found: {$record['retailer']}; please check spelling.";
            return false;
        } else {
            $retailerName = is_string($retailer) ? $retailer : $retailer->name;
        }

        $icp = $record['icp'];
        $accountNumber = $record['account number'];
        // 3. Look at the User's active Donations
        $donation = $this->donationForRecord($user, $retailerName, $icp, $accountNumber);
        // 3e. If still no Donation found, raise an error
        if (!$donation) {
            $this->lastError = "Could not find a matching donation.";
            return false;
        }

        // 4. Check if any Past Donations are linked to the Donation found in step 3
        //   a. If no Past Donation found, carry on
        //   b. If Past Donations found, check if any of them are for the same Donation Date and amount as specified in the line
        //   c. If at least one Past Donation matches, then raise an error, otherwise carry on
        foreach ($donation->pastDonations as $linkedPastDonation) {
            $dateMatches = $linkedPastDonation->date == $record['donation date'];
            $amountMatches = $linkedPastDonation->amount == $record['donation amount'];
            $retailerMatches = $linkedPastDonation->retailer == $retailerName;
            if ($dateMatches && $amountMatches && $retailerMatches) {
                $this->lastError = "Past donation already recorded.";
                return false;
            }
        }

        return true;
    }

    public function importRecord(array $record)
    {
        $record = $this->normaliseRecord($record);
        // 5. Create a Past Donation with the data specified in the line, and link it to the Donation found in step 3
        $retailerName = $this->retailerNameForField($record['retailer']);
        $user = $this->donorForField($record['email address']);
        $donation = $this->donationForRecord($user, $retailerName, $record['icp'], $record['account number']);

        if ($donation && $retailerName) {
            return PastDonation::create([
                'donation_id' => $donation->id,
                'retailer' => $retailerName,
                'icp' => empty($record['icp']) ? $donation->icp : $record['icp'],
                'date' => $record['donation date'],
                'amount' => $record['donation amount'],
                'account_number' => empty($record['account number']) ? $donation->account_number : $record['account number'],
            ]);
        } else {
            $this->lastError = 'Could not record past donation; please contact vendor';
        }
        return null;
    }

    public function getLastError(): string
    {
        return $this->lastError;
    }

    private function retailerNameForField($fieldValue): Retailer|string|null
    {
        if (empty($fieldValue)) {
            return null;
        }
        $retailerIsOther = Str::startsWith($fieldValue, 'Other - ');
        return $retailerIsOther ? Str::substr($fieldValue, 8) : $fieldValue;
    }

    private function donorForField($fieldValue): User|null
    {
        /* @var ?User $user */
        $user = User::whereRaw("lower(email) = lower(?)", [$fieldValue])->first();
        if ($user && $user->isDonor()) {
            return $user;
        }
        return null;
    }

    private function donationForRecord(?User $user, string $retailerName, string $icp, string $accountNumber): ?Donation
    {
        if (!$user) {
            return null;
        }
        // 3. Look at the User's active Donations
        //   a. Find the most recently created Donation that matches the line's Retailer, ICP, and Account number
        $baseQuery = Donation::where('user_id', $user->id);
        $broadQuery = $baseQuery->clone();
        //   b. If one or more of these aren't specified in the line, just match on what is specified
        if (!empty($retailerName)) {
            $broadQuery = $broadQuery->where('retailer', $retailerName);
        }
        if (!empty($icp)) {
            $broadQuery = $broadQuery->where('icp', $icp);
        }
        if (!empty($accountNumber)) {
            $broadQuery = $broadQuery->where('account_number', $accountNumber);
        }

        $donation = $broadQuery
            ->orderBy('is_active', 'desc')
            ->orderBy('updated_at', 'desc')
            ->first();
        //   c. If no Donation is found, try to match just the Retailer, if specified in the line
        if (!$donation && !empty($retailerName)) {
            $donation = $baseQuery
                ->clone()
                ->where('retailer', $retailerName)
                ->orderBy('is_active', 'desc')
                ->orderBy('updated_at', 'desc')
                ->first();
        }
        //   d. If still no Donation found, just use the most recently created Donation from any Retailer
        if (!$donation) {
            $donation = $baseQuery
                ->clone()
                ->orderBy('is_active', 'desc')
                ->orderBy('updated_at', 'desc')
                ->first();
        }

        return $donation;
    }
}
