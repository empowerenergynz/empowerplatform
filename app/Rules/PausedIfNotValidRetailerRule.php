<?php

declare(strict_types=1);

namespace App\Rules;

use App\Models\Retailer;
use Illuminate\Contracts\Validation\Rule;

class PausedIfNotValidRetailerRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(private string $retailer)
    {
    }

    /**
     * If the retailer is not in the known list, then the attribute (is_active) must be false (paused)
     * a.k.a return true if retailer is in known list, or attribute is false
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        $retailerNames = array_map(fn ($retailer) => $retailer['name'], Retailer::getDonatableCached());
        return in_array($this->retailer, $retailerNames) || $value === false;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return "Donation must be paused if the Retailer is not signed up.";
    }
}
