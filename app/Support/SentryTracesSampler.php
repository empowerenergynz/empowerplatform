<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class SentryTracesSampler
{
    public static function make(): float
    {
        $requestPath = Request::path();
        if ('healthcheck' === $requestPath || Str::contains($requestPath, 'telescope')) {
            return 0.0;
        }

        return (float) (env('SENTRY_TRACES_SAMPLE_RATE', 0.0));
    }
}
