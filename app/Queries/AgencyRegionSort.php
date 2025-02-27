<?php

declare(strict_types=1);

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AgencyRegionSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query
            ->leftJoin('regions', 'agencies.region_id', '=', 'regions.id')
            ->orderBy("regions.$property", $direction)
            ->select('agencies.*')
        ;

    }
}
