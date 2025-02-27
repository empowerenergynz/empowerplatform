<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\SignUpRequest;
use App\Models\User;
use App\Models\UserInvitation;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class SignUpRequestTest extends RequestTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create();
        $this->userInvitation = UserInvitation::create([
            'user_id' => $user->id,
            'token' => 'generated_token',
            'created_at' => Carbon::now(),
        ]);
    }

    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_pass_when_phone_is_empty' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'phone_number' => '',
                ]),
            ],
            'request_should_fail_when_email_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'email' => 'foo',
                ]),
            ],
            'request_should_fail_when_password_is_too_short' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'password' => 'foo',
                    'password_confirmation' => 'foo',
                ]),
            ],
            'request_should_fail_when_password_do_not_match' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'password_confirmation' => 'another password',
                ]),
            ],
            'request_should_fail_when_token_does_not_exists' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'token' => 'foo',
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeUser = User::factory()->make();

        return array_merge([
            'phone_number' => $fakeUser->phone_number,
            'email' => $fakeUser->email,
            'password' => 'MY_SECURE_PASSWORD',
            'password_confirmation' => 'MY_SECURE_PASSWORD',
            'token' => $this->userInvitation->token,
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new SignUpRequest($mockedRequestData);
    }
}
