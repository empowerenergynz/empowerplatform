<?php declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SignUpRequest extends FormRequest
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
            'email' =>  ['required', 'email'],
            'phone_number' => ['nullable','phone:AUTO'],
            'password' => ['required', 'string', 'min:12','confirmed'],
            'token' => ['required', 'exists:user_invitations,token'],
        ];
    }

    public function getUserData()
    {
        return [
            'password' => Hash::make($this->password),
            'phone_number' => $this->phone_number,
        ];
    }

    /**
     * @throws ValidationException
     *
     * @return void
     */
    public function authenticate(): void
    {
        if (!Auth::attempt($this->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }
    }
}
