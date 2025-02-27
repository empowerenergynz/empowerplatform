<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequestTest extends RequestTestCase
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
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_pass_when_last_name_is_empty' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'last_name' => '',
                ]),
            ],
            'request_should_fail_when_first_name_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'first_name' => '',
                ]),
            ],
            'request_should_fail_when_email_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput(['email' => 'foo']),
            ],
            'request_should_fail_when_email_already_exists' => [
                'request_should_pass_when_names_are_empty' => [
                    'passed' => true,
                    'data' => $this->makeInput([
                        'first_name' => '',
                        'last_name' => '',
                    ]),
                ],
                'passed' => false,
                'data' => $this->makeInput(['email' => 'email_exists@empower.local']),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeUser = User::factory()->make();

        return array_merge([
            'first_name' => $fakeUser->first_name,
            'last_name' => $fakeUser->last_name,
            'phone_number' => $fakeUser->phone_number,
            'email' => $fakeUser->email,
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return (new UpdateProfileRequest($mockedRequestData))->setUserResolver(fn () => $this->updatedUser);
    }
}
