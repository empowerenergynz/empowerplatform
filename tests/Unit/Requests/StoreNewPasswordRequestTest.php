<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\StoreNewPasswordRequest;
use Illuminate\Foundation\Http\FormRequest;

class StoreNewPasswordRequestTest extends RequestTestCase
{
    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_token_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput(['token' => '']),
            ],
            'request_should_fail_when_passwords_mismatch' => [
                'passed' => false,
                'data' => $this->makeInput(['password_confirmation' => 'foo']),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        return array_merge([
            'token' => 'foo',
            'email' => 'foo@empower.local',
            'password' => 'my_secure_password',
            'password_confirmation' => 'my_secure_password',
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new StoreNewPasswordRequest($mockedRequestData);
    }
}
