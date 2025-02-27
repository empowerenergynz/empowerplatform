<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\PastDonation;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class PastDonationsQuery
{
    public function __construct(private Request $request)
    {
    }

    public function __invoke(): QueryBuilder
    {
        return QueryBuilder::for(PastDonation::class, $this->request)
            ->allowedSorts(['date'])
            ->defaultSort('-date');
    }
}
