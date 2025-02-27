<?php

declare(strict_types=1);

namespace Tests\Unit\Rules;

use App\Rules\LocationCoordinates;
use Tests\TestCase;

class LocationCoordinatesTest extends TestCase
{
    public function test_it_validates_the_location_coordinates_rule()
    {
        $rule = ['location' => [new LocationCoordinates]];

        $this->assertTrue(validator(['location' => '1, 1'], $rule)->passes());
        $this->assertTrue(validator(['location' => '1.0,1.0'], $rule)->passes());
        $this->assertTrue(validator(['location' => '90.0,180.0'], $rule)->passes());
        $this->assertTrue(validator(['location' => '-77.0364335, 38.89515557'], $rule)->passes());
        $this->assertTrue(validator(['location' => '49.26405973232833, -123.24941184720426'], $rule)->passes());
    }

    public function test_it_fails_with_invalid_coordinates()
    {
        $rule = ['location' => [new LocationCoordinates]];

        $this->assertFalse(validator(['location' => '1'], $rule)->passes());
        $this->assertFalse(validator(['location' => 'foo'], $rule)->passes());
        $this->assertFalse(validator(['location' => 'foo,bar'], $rule)->passes());
    }

    public function test_it_fails_with_invalid_boundaries()
    {
        $rule = ['location' => [new LocationCoordinates]];

        $this->assertFalse(validator(['location' => '90.0,181.0'], $rule)->passes());
        $this->assertFalse(validator(['location' => '91.0,180.0'], $rule)->passes());
    }

    public function test_it_fails_when_coordinates_are_too_long()
    {
        $rule = ['location' => [new LocationCoordinates]];

        $this->assertFalse(validator(['location' => '-77.036433578965210235486510, 38.895155576'], $rule)->passes());
        $this->assertFalse(validator(['location' => '-77.036433, 38.036433578965210235486510'], $rule)->passes());
    }
}
