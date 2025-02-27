<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\StorePastDonationRequest;
use App\Models\PastDonation;
use Illuminate\Foundation\Http\FormRequest;

class StorePastDonationRequestTest extends RequestTestCase
{
    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_icp_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'icp' => '',
                ]),
            ],
            'request_should_fail_when_account_number_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'account_number' => '',
                ]),
            ],
            'request_should_fail_when_amount_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '',
                ]),
            ],
            'request_should_fail_when_amount_is_zero' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '0',
                ]),
            ],
            'request_should_fail_when_amount_has_3_dp' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '1.123',
                ]),
            ],
            'request_should_fail_when_amount_has_nothing_before_the_dp' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '.12',
                ]),
            ],
            'request_should_fail_when_date_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'date' => '',
                ]),
            ],
            'request_should_fail_when_date_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'date' => '2022-02-31', // there is no 31st Feb ;-)
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeDonation = PastDonation::factory()->make();

        return array_merge([
            'icp' => $fakeDonation->icp,
            'account_number' => $fakeDonation->account_number,
            'amount' => "1.23",
            'date' => "2022-01-01",
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new StorePastDonationRequest($mockedRequestData);
    }
}
