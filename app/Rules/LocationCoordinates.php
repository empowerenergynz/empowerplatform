<?php declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class LocationCoordinates implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * The latitude and longitude may have a maximum of
     * twenty digits after the decimal point. This provides
     * an accuracy of up to ~1 millimeter.
     *
     **/
    public function passes($attribute, $value): bool
    {
        return preg_match(
                '/^[-]?((([0-8]?[0-9])(\.(\d{1,20}))?)|(90(\.0+)?)),\s?[-]?((((1[0-7][0-9])|([0-9]?[0-9]))(\.(\d{1,20}))?)|180(\.0+)?)$/',
                $value
            ) > 0;
    }

    /**
     * Get the validation error message.
     *
     **/
    public function message(): string
    {
        return 'The :attribute must be a valid set of latitude and longitude coordinates, with a limit of 20 digits after a decimal point';
    }
}
