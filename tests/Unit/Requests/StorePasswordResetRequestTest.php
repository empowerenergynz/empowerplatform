<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\StorePasswordResetRequest;
use Illuminate\Foundation\Http\FormRequest;

class StorePasswordResetRequestTest extends RequestTestCase
{
    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_email_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput(['email' => '']),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        return array_merge([
            'email' => 'foo@empower.local',
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new StorePasswordResetRequest($mockedRequestData);
    }
}
