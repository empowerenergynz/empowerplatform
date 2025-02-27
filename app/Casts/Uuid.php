<?php declare(strict_types=1);

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Ramsey\Uuid\UuidInterface;

class Uuid implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string $key
     * @param mixed $value
     * @param array $attributes
     *
     * @return UuidInterface
     */
    public function get($model, $key, $value, $attributes): UuidInterface
    {
        return \Ramsey\Uuid\Uuid::fromString($value);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string $key
     * @param UuidInterface $value
     * @param array $attributes
     *
     * @return mixed
     */
    public function set($model, $key, $value, $attributes): mixed
    {
        return $value->toString();
    }
}
