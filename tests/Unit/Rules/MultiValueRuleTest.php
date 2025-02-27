<?php

declare(strict_types=1);

namespace Tests\Unit\Rules;

use App\Rules\MultiValueRule;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class MultiValueRuleTest extends TestCase
{
    public function test_it_passes_with_a_valid_array()
    {
        $rule = new MultiValueRule('distinct', 'Not distinct enough');
        $this->assertTrue(Validator::make(['test' => ['foo', 'bar']], ['test' => [$rule]])->passes());
    }

    public function test_it_fails_with_an_invalid_array()
    {
        $rule = new MultiValueRule('distinct', 'Not distinct enough');
        $this->assertFalse(Validator::make(['test' => ['foo', 'foo']], ['test' => [$rule]])->passes());
    }

    public function test_it_passes_with_a_valid_nested_array_when_a_key_is_provided()
    {
        $rule = new MultiValueRule('distinct', 'Not distinct enough', 'name');
        $this->assertTrue(Validator::make(['test' => [['name' => 'foo'], ['name' => 'bar']]], ['test' => [$rule]])->passes());
    }

    public function test_it_fails_with_an_invalid_nested_array_when_a_key_is_provided()
    {
        $rule = new MultiValueRule('distinct', 'Not distinct enough', 'name');
        $this->assertFalse(Validator::make(['test' => [['name' => 'foo'], ['name' => 'foo']]], ['test' => [$rule]])->passes());
    }

    public function test_it_returns_the_expected_message_when_the_rule_does_not_pass()
    {
        $rule = new MultiValueRule('distinct', $message = 'Not distinct enough');
        $validator = Validator::make(['test' => ['foo', 'foo']], ['test' => [$rule]]);
        $validator->passes();
        $this->assertEquals([$message], $validator->errors()->get('test'));
    }
}
