<?php declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\MultiValueRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadFilesRequest extends FormRequest
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
        $mimes = 'jpg,jpeg,png,gif,doc,docx,pdf,txt';

        return [
            'files' => [
                'nullable',
                'array',
                new MultiValueRule("mimes:$mimes", "The files must be a of type: $mimes."),
                new MultiValueRule('max:5120', "The files must not be greater than 5MB."),
            ],
        ];
    }
}
