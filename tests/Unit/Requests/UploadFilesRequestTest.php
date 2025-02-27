<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use App\Http\Requests\UploadFilesRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class UploadFilesRequestTest extends RequestTestCase
{
    protected function validationTests(): array
    {
        return [
            'request_should_pass_when_input_is_valid' => [
                'passed' => true,
                'data' => $this->makeInput(),
            ],
            'request_should_fail_when_upload_files_contain_a_video' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'files' => [
                        UploadedFile::fake()->image('plan.jpg'),
                        UploadedFile::fake()->create('plan.mp4', 200, 'video/mp4'),
                    ]
                ]),
            ],
            'request_should_fail_when_upload_files_contain_a_file_larger_than_1024_mb' => [
                'passed' => false,
                'data' => $this->makeInput([
                    'files' => [
                        UploadedFile::fake()->create('map.jpg', 8000, 'application/pdf'),
                    ]
                ]),
            ],
        ];
    }

    protected function makeInput(array $overrides = []): array
    {
        $name = 'plan.jpg';
        $fileA = UploadedFile::fake()->image($name);

        return array_merge([
            'files' => [$fileA],
        ], $overrides);
    }

    protected function makeRequest(array $mockedRequestData): FormRequest
    {
        return new UploadFilesRequest($mockedRequestData);
    }
}
