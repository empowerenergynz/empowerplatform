<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\AuthRequest;
use Faker\Factory;
use Illuminate\Foundation\Http\FormRequest;

class AuthRequestTest extends RequestTestCase
{
    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_email_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput(['email' => 'foo']),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $faker = Factory::create(config('app.faker_locale'));

        return array_merge([
            'email' => $faker->email(),
            'password' => $faker->word(),
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new AuthRequest($mockedRequestData);
    }
}
