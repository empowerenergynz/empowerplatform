<?php declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePastDonationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'icp' => ['required', 'string', 'max:255'],
            'account_number' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            // no more than 2 decimal places
            'amount' => ['required', 'numeric', 'gt:0', 'regex:/^\d+(\.\d{0,2})?$/'],
        ];
    }
}
