<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\StoreAgencyRequest;
use App\Models\Agency;
use App\Models\Region;
use Illuminate\Foundation\Http\FormRequest;

class StoreAgencyRequestTest extends RequestTestCase
{
    protected function validationTests(): array
    {
        Agency::factory()->create([
            'name' => 'Existing Agency',
        ]);
        $region = Region::factory()->create();

        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_name_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'name' => '',
                ]),
            ],
            'request_should_fail_when_name_is_duplicate' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'name' => 'EXISTING aGENCY',
                ]),
            ],
            'request_should_pass_when_region_exists' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'region_id' => $region->id,
                ]),
            ],
            'request_should_fail_when_region_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'region_id' => 234523453,
                ]),
            ],
            'request_should_fail_when_balance_is_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'balance' => '',
                ]),
            ],
            'request_should_pass_when_balance_is_zero' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'balance' => 0,
                ]),
            ],
            'request_should_fail_when_balance_is_invalid_string' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'balance' => 'void',
                ]),
            ],
            'request_should_fail_when_balance_is_negative' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'balance' => '-3',
                ]),
            ],
            'request_should_fail_when_balance_date_is_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'balance_date' => '',
                ]),
            ],
            'request_should_fail_when_balance_date_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'balance_date' => 'void',
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeAgency = Agency::factory()->make();

        return array_merge([
            'name' => $fakeAgency->name,
            'balance' => $fakeAgency->balance,
            'balance_date' => $fakeAgency->balance_date,
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new StoreAgencyRequest($mockedRequestData);
    }
}
