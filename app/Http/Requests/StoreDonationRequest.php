<?php declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\LocationCoordinates;
use App\Rules\UserWithRoleDonorRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDonationRequest extends FormRequest
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
        $retailer = $this->get('retailer') ?? '';
        return [
            'address' => ['nullable', 'string', 'max:255'],
            'gps_coordinates' => ['nullable', 'string', 'max:255', new LocationCoordinates],
            'icp' => ['required', 'string', 'max:255'],
            'retailer' => ['required', 'string', 'max:255'],
            'account_number' => ['required', 'string', 'max:255'],
            // no more than 2 decimal places
            'amount' => ['required', 'numeric', 'gt:0', 'regex:/^\d+(\.\d{0,2})?$/'],
            'is_dollar' => ['required', 'boolean'],
            // no more than 4 decimal places, required if is_dollar is false
            'buyback_rate' => ['exclude_if:is_dollar,true','required', 'numeric', 'gte:0', 'regex:/^\d+(\.\d{0,4})?$/'],
            'is_active' => ['required', 'boolean'],
            'user_id' => ['required', 'numeric', 'exists:users,id', new UserWithRoleDonorRule],
        ];
    }
}
