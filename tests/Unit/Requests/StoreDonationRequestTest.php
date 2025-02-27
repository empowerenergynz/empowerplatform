<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use App\Models\Retailer;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreDonationRequestTest extends RequestTestCase
{
    private User $donor;
    private User $admin;

    public function setUp(): void
    {
        parent::setUp();

        Retailer::create([
           'id' => 1,
           'name' => 'Meridian',
        ]);

        $this->donor = User::factory()->create();
        $this->donor->assignRole(User::ROLE_DONOR);

        $this->admin = User::factory()->create();
        $this->admin->assignRole(User::ROLE_ADMIN);
    }

    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_pass_when_gps_coordinates_and_address_are_empty' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'gps_coordinates' => '',
                    'address' => '',
                ]),
            ],
            'request_should_fail_when_gps_coordinates_are_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'gps_coordinates' => 'foo,bar',
                ]),
            ],
            'request_should_fail_when_icp_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'icp' => '',
                ]),
            ],
            'request_should_fail_when_retailer_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'retailer' => '',
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
            'request_should_fail_when_is_dollar_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'is_dollar' => '',
                ]),
            ],
            'request_should_fail_when_is_active_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'is_active' => '',
                ]),
            ],
            'request_should_fail_when_user_id_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'user_id' => '',
                ]),
            ],
            'request_should_fail_when_user_id_is_admin' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'user_id' => $this->admin->id,
                ]),
            ],
            'request_should_fail_if_no_buyback_with_percent_donation' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'is_dollar' => false,
                    'buyback_rate' => null,
                ]),
            ],
            'request_should_pass_if_valid_buyback_with_percent_donation' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'is_dollar' => false,
                    'buyback_rate' => '20.45',
                ]),
            ],
            'request_should_pass_if_buyback_to_4dp_with_percent_donation' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'is_dollar' => false,
                    'buyback_rate' => '0.1258',
                ]),
            ],
            'request_should_fail_if_buyback_to_5dp_with_percent_donation' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'is_dollar' => false,
                    'buyback_rate' => '0.12759',
                ]),
            ],
            'request_should_pass_if_zero_buyback_with_percent_donation' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'is_dollar' => false,
                    'buyback_rate' => '0.00',
                ]),
            ],
            'request_should_fail_if_negative_buyback_with_percent_donation' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'is_dollar' => false,
                    'buyback_rate' => '-1.50',
                ]),
            ],
            'request_should_pass_if_active_with_unknown_retailer' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'retailer' => 'unknown',
                    'is_active' => true,
                ]),
            ],
            'request_should_pass_if_paused_with_unknown_retailer' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'retailer' => 'unknown',
                    'is_active' => false,
                ]),
            ],
            'request_should_pass_if_paused_with_known_retailer' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'retailer' => Retailer::getDonatableCached()[0]['name'],
                    'is_active' => true,
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeDonation = Donation::factory()->make();

        $mergedInput =  array_merge([
            'address' => $fakeDonation->address,
            'gps_coordinates' => $fakeDonation->gps_coordinates,
            'user_id' => $this->donor->id,
            'icp' => $fakeDonation->icp,
            'retailer' => Retailer::getDonatableCached()[0]['name'],
            'account_number' => $fakeDonation->account_number,
            'amount' => "1.23",
            'buyback_rate' => $fakeDonation->buyback_rate,
            'is_dollar' => $fakeDonation->is_dollar,
            'is_active' => $fakeDonation->is_active,
        ], $overrides);

        if (key_exists('buyback_rate', $overrides) && $overrides['buyback_rate'] === null) {
            unset($mergedInput['buyback_rate']);
        }

        return $mergedInput;
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new StoreDonationRequest($mockedRequestData);
    }
}
