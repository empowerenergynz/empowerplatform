<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Credit;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CreditsQuery
{
    public function __construct(private Request $request)
    {
    }

    public function __invoke(): QueryBuilder
    {
        // In MVP we only have sorting by reverse date and a filter on the status
        return QueryBuilder::for(Credit::class, $this->request)
            ->allowedFilters([
                AllowedFilter::scope('status'),
            ])
            ->defaultSorts(['-created_at']);
    }
}

