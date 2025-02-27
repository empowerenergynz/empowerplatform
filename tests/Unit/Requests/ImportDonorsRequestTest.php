<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\ImportDonorsRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class ImportDonorsRequestTest extends RequestTestCase
{
    public function setUp(): void
    {
        parent::setUp();
    }

    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_csv_is_empty' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'csv' => null,
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        return array_merge([
            'csv' => UploadedFile::fake()->createWithContent('import.csv', 'content'),
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new ImportDonorsRequest($mockedRequestData);
    }
}
