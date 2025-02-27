<?php declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Role;

class UpdateUserRequest extends FormRequest
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
        $roleIds = $this->roles;
        $agencyRoleNames = [User::ROLE_AGENCY_ADMIN, User::ROLE_AGENCY_USER];
        $isAgencyRole = Role::query()
                ->whereIn('id', $roleIds)
                ->whereIn('name', $agencyRoleNames)
                ->count() > 0;

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'phone:AUTO'],
            'email' => ['required', 'email', 'max:255', "iunique:users,email,{$this->user->id}"],
            'roles' => ['required', 'array', 'exists:roles,id'],
            'agency_id' => $isAgencyRole
                ? ['required', 'numeric', 'exists:agencies,id']
                : ['prohibited', 'nullable'],
        ];
    }
}
