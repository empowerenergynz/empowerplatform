<?php

declare(strict_types=1);

namespace Tests\Unit\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

abstract class RequestTestCase extends \Tests\TestCase
{
    use RefreshDatabase;

    /** @var \Illuminate\Validation\Validator */
    protected $validator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->validator = app()->get('validator');
    }

    /**
     * Configure validation tests that should be run. This should include tests for any complex rules or rule
     * combinations, but not be exhaustive.
     */
    abstract protected function validationTests(): array;

    /**
     * Return the input for testing.
     */
    abstract protected function makeInput(array $overrides = []): array;

    /**
     * Build the form request with the mock data.
     */
    abstract protected function makeRequest(array $mockedRequestData): FormRequest;

    /**
     * @group validation
     */
    public function test_it_validates_the_request_as_expected()
    {
        foreach ($this->validationTests() as $test => $dataset) {
            $this->assertSame(
                $dataset['passed'],
                $this->validate($dataset['data'], $dataset['passed']),
                "$test failed"
            );
        }
    }

    protected function validate($mockedRequestData, bool $expectToPass)
    {
        $request = $this->makeRequest($mockedRequestData);
        $validator = $this->validator
            ->make($request->validationData(), $request->rules());

        if (method_exists($request, 'withValidator')) {
            $request->withValidator($validator);
            $request->setValidator($validator);
            try {
                $request->validated();
                $passes = $validator->passes();
            } catch (ValidationException $e) {
                $passes = false;
            }
        } else {
            $passes = $validator->passes();
        }

        if ($passes != $expectToPass) {
            dump($validator->errors()->messages());
        }

        return $passes;
    }
}
