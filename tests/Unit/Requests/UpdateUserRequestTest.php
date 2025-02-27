<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\UpdateUserRequest;
use App\Models\Agency;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Role;

class UpdateUserRequestTest extends RequestTestCase
{
    private User $updatedUser;

    public function setUp(): void
    {
        parent::setUp();
        User::factory()->create([
            'email' => 'email_exists@empower.local',
        ]);
        $this->updatedUser = User::factory()->create();
    }

    protected function validationTests(): array
    {
        $agencyAdminRole = Role::findByName(User::ROLE_AGENCY_ADMIN);
        $agencyUserRole = Role::findByName(User::ROLE_AGENCY_USER);
        $otherRole = Role::findByName(User::ROLE_ADMIN);
        $agency = Agency::factory()->create();

        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_pass_when_names_phone_and_job_are_empty' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'last_name' => '',
                    'phone_number' => '',
                ]),
            ],
            'request_should_fail_when_email_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput(['email' => 'foo']),
            ],
            'request_should_fail_when_role_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput(['roles' => []]),
            ],
            'request_should_fail_when_role_does_not_exist' => [
                'passed' => false,
                'data' => $this->makeInput(['roles' => [123456]]),
            ],
            'request_should_fail_when_email_already_exists' => [
                'passed' => false,
                'data' => $this->makeInput(['email' => 'email_EXISTS@eMpOwEr.local']),
            ],
            'request_should_fail_if_agency_admin_role_with_no_agency_id' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'roles' => [$agencyAdminRole->id],
                    'agency_id' => '',
                ]),
            ],
            'request_should_fail_if_agency_user_role_with_no_agency_id' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'roles' => [$agencyUserRole->id],
                    'agency_id' => '',
                ]),
            ],
            'request_should_pass_if_agency_admin_role_with_valid_agency_id' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'roles' => [$agencyAdminRole->id],
                    'agency_id' => $agency->id,
                ]),
            ],
            'request_should_pass_if_agency_user_role_with_valid_agency_id' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'roles' => [$agencyAdminRole->id],
                    'agency_id' => $agency->id,
                ]),
            ],
            'request_should_fail_if_agency_role_with_invalid_agency_id' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'roles' => [$agencyAdminRole->id],
                    'agency_id' => 1234134234,
                ]),
            ],
            'request_should_fail_if_not_agency_role_with_valid_agency_id' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'roles' => [$otherRole->id],
                    'agency_id' => $agency->id,
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeUser = User::factory()->make();
        $donorRole = Role::where('name', User::ROLE_DONOR)->first();

        return array_merge([
            'first_name' => $fakeUser->first_name,
            'last_name' => $fakeUser->last_name,
            'phone_number' => $fakeUser->phone_number,
            'email' => $fakeUser->email,
            'roles' => [$donorRole->id],
            'agency_id' => '',
            'user' => $this->updatedUser,
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new UpdateUserRequest($mockedRequestData);
    }
}
