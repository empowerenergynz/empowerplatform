<?php

declare(strict_types=1);

namespace App\Http\Session;

use Illuminate\Contracts\Support\Arrayable;

class FlashMessage implements Arrayable
{
    public function __construct(public string $status, public string $title, public string $content, )
    {
    }

    public function toArray(): array
    {
        return (array) $this;
    }
}
