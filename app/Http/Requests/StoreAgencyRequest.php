<?php declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgencyRequest extends FormRequest
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
            'name' => ['required', 'string', 'iunique:agencies'],
            'region_id' => ['nullable', 'numeric', 'exists:regions,id'],
            'district_id' => ['nullable', 'numeric', 'exists:districts,id'],
            'balance' => ['required', 'integer', 'min:0'],
            'balance_date' => ['required', 'date'],
        ];
    }
}
