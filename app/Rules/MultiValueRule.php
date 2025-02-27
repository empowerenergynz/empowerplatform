<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class MultiValueRule implements Rule
{
    private \Illuminate\Validation\Validator $validator;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(string|Rule $rule, private string $message = 'This field is invalid', private ?string $key = null)
    {
        $this->validator = Validator::make(['values' => []], ['values.*' => [$rule]]);
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        $values = $this->key ? Arr::pluck($value, $this->key) : $value;
        $this->validator->setData(['values' => $values]);

        return $this->validator->passes();
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return $this->message;
    }
}
