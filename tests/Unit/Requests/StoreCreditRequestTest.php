<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\StoreCreditRequest;
use App\Models\Agency;
use App\Models\Credit;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreCreditRequestTest extends RequestTestCase
{
    private User $agencyUser;
    private Agency $agency;
    private Retailer $retailer;
    private Region $region;
    private District $district;

    public function setUp(): void
    {
        parent::setUp();

        $this->region = Region::factory()->create();
        $this->district = District::factory()->create();
        $this->agencyUser = User::factory()->create();
        $this->agency = Agency::factory()->create();
        $this->retailer = Retailer::factory()->create();
    }

    protected function validationTests(): array
    {
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
            'request_should_fail_when_region_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'region_id' => 234523453,
                ]),
            ],
            'request_should_fail_when_amount_is_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '',
                ]),
            ],
            'request_should_fail_when_amount_is_zero' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => 0,
                ]),
            ],
            'request_should_fail_when_amount_is_invalid_string' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => 'void',
                ]),
            ],
            'request_should_fail_when_amount_is_negative' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '-3',
                ]),
            ],
            'request_should_fail_when_account_is_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'account' => '',
                ]),
            ],
            'request_should_fail_when_account_is_5_digits' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'account' => '12345',
                ]),
            ],
            'request_should_pass_when_notes_missing_for_approved_amount' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'amount' => StoreCreditRequest::APPROVED_AMOUNTS[0],
                    'notes' => '',
                ]),
            ],
            'request_should_fail_when_notes_missing_for_random_amount' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'amount' => '2',
                    'notes' => '',
                ]),
            ],
            'request_should_pass_when_notes_present_for_random_amount' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'amount' => '2',
                    'notes' => 'a note',
                ]),
            ],
            'request_should_fail_when_retailer_id_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'retailer_id' => '',
                ]),
            ],
            'request_should_fail_when_retailer_id_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'retailer_id' => '23423424234',
                ]),
            ],
            'request_should_fail_when_district_id_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'district_id' => '',
                ]),
            ],
            'request_should_fail_when_district_id_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'district_id' => '23423424234',
                ]),
            ],
            'request_should_fail_when_region_id_missing' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'region_id' => '',
                ]),
            ],
            'request_should_fail_when_region_id_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'retailer_id' => '23423424234',
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $fakeCredit = Credit::factory()->make();

        return array_merge([
            'name' => $fakeCredit->name,
            'amount' => 100,
            'notes' => '',
            'account' => $fakeCredit->account,
            'region_id' => $this->region->id,
            'district_id' => $this->district->id,
            'retailer_id' => $this->retailer->id,
            'agency_id' => $this->agency->id,
            'created_by_id' => $this->agencyUser->id,
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new StoreCreditRequest($mockedRequestData);
    }
}
