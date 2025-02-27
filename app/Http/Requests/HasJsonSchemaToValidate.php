<?php declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Validation\Validator;
use Opis\JsonSchema\Errors\ErrorFormatter;
use Opis\JsonSchema\Helper;
use Opis\JsonSchema\Validator as JsonSchemaValidator;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

trait HasJsonSchemaToValidate
{
    public function validateJsonSchema(Validator $validator, string $jsonSchema, mixed $value)
    {
        $validator->after(function ($validator) use ($jsonSchema, $value) {
            $jsonSchemaValidator = new JsonSchemaValidator();
            $schema = Helper::toJSON(json_decode($jsonSchema));

            $result = $jsonSchemaValidator->validate((object) $value, $schema);

            if ($result->hasError()) {
                $formatter = new ErrorFormatter();
                if ($result->error()->keyword() === 'required') {
                    throw new BadRequestHttpException();
                }
                foreach ($result->error()->subErrors() as $error) {
                    $errorPath = implode('.', $error->data()->path());
                    $key = 'attributes.'.$errorPath;
                    $formattedError = $formatter->formatErrorMessage($error);
                    if (preg_match('/^.*must match the type:.*$/', $formattedError)) {
                        $validator->errors()->add($key, "The $errorPath field is required.");
                    } else {
                        $validator->errors()->add($key, $formattedError);
                    }
                }
            }
        });
    }
}
