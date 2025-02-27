<?php declare(strict_types=1);

namespace App\Importers;


use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DonorImporter
{
    use NormalisesRecords;

    private string $lastError = '';

    private array $validationRules = [
        "first name" => ['required', 'string', 'max:255'],
        "last name" => ['required', 'string', 'max:255'],
        "email address" => ['required', 'email', 'max:255', 'iunique:users,email'],
        "phone" => ['required', 'string', 'max:2000'],
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

        $validator = Validator::make($record, $this->validationRules);

        if (!$validator->passes()) {
            foreach ($validator->errors()->getMessages() as $field => $messages) {
                $formattedField = Str::ucfirst($field);
                $this->lastError = "{$formattedField}: {$messages[0]}";
            }
            return false;
        }

        return true;
    }

    public function importRecord(array $record): ?User
    {
        $record = $this->normaliseRecord($record);

        $donorRole = Role::where('name', User::ROLE_DONOR)->first();

        if ($donorRole) {
            $donor = User::create([
                'first_name' => $record['first name'],
                'last_name' => $record['last name'],
                'email' => $record['email address'],
                'phone_number' => $record['phone'],
                'password' => Hash::make(Str::random()),
            ]);
            $donor->assignRole($donorRole);

            return $donor;
        } else {
            $this->lastError = 'Donor role not found; please contact vendor';
        }
        return null;
    }

    public function getLastError(): string
    {
        return $this->lastError;
    }
}
