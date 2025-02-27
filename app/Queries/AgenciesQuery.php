<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Agency;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class AgenciesQuery
{
    public function __construct(private Request $request)
    {
    }

    public function __invoke(): QueryBuilder
    {
        return QueryBuilder::for(Agency::class, $this->request)
            ->allowedSorts([
                'name',
                'balance',
                AllowedSort::custom('region', new AgencyRegionSort(), 'name'),
                AllowedSort::custom('district', new AgencyDistrictSort(), 'name'),
            ])
            ->allowedFilters([
                AllowedFilter::scope('search'),
            ])
            ->defaultSort('name');
    }
}
