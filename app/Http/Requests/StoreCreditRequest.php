<?php declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCreditRequest extends FormRequest
{
    public const APPROVED_AMOUNTS = ['100', '200', '300'];

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
        $isApprovedAmount = in_array($this->amount, self::APPROVED_AMOUNTS);
        return [
            'name' => ['required', 'string'],
            'amount' => ['required', 'integer', 'min:1'],
            // min_digits requires laravel/framework 9.26
            'account' => ['required', 'integer', 'min_digits:6'],
            'notes' => [Rule::requiredIf(!$isApprovedAmount)],
            'retailer_id' => ['required', 'numeric', 'exists:retailers,id'],
            'region_id' => ['required', 'numeric', 'exists:regions,id'],
            'district_id' => ['required', 'numeric', 'exists:districts,id'],
        ];
    }
}
