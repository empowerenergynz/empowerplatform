<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Enums\CreditStatus;
use App\Http\Requests\UpdateManyCreditStatusRequest;
use App\Models\Agency;
use App\Models\Credit;
use App\Models\District;
use App\Models\Region;
use App\Models\Retailer;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateManyCreditStatusRequestTest extends RequestTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->region = Region::factory()->create();
        $this->district = District::factory()->create();
        $this->region->districts()->attach($this->district);
        $this->agencyUser = User::factory()->create();
        $this->agency = Agency::factory()->create();
        $this->retailer = Retailer::factory()->create();
        $this->credits = Credit::factory()->count(2)->create();
        $this->creditIds = $this->credits->pluck('id')->toArray();
    }

    protected function validationTests(): array
    {

        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_ids_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'ids' => [],
                ]),
            ],
            'request_should_fail_when_status_is_invalid' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'status' => 123,
                ]),
            ],
            'request_should_pass_when_admin_notes_is_present_for_rejected' => [
                'passed' => true,
                'data' => $this->makeInput([
                    'status' => CreditStatus::Rejected,
                    'admin_notes' => 'Incorrect a/c number',
                ]),
            ],
            'request_should_fail_when_admin_notes_is_missing_for_rejected' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'status' => CreditStatus::Rejected,
                    'admin_notes' => '',
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        return array_merge([
            'ids' => $this->creditIds,
            'status' => CreditStatus::Exported,
            'admin_notes' => '',
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new UpdateManyCreditStatusRequest($mockedRequestData);
    }
}
