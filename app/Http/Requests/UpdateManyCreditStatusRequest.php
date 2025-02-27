<?php declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CreditStatus;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Foundation\Http\FormRequest;

class UpdateManyCreditStatusRequest extends FormRequest
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
            'ids' => ['required', 'array'],
            'status' => ['required', new EnumValue(CreditStatus::class)],
            'admin_notes' => ['required_if:status,' . CreditStatus::Rejected],
        ];
    }
}
