<?php

declare(strict_types=1);

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AgencyDistrictSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query
            ->leftJoin('districts', 'agencies.district_id', '=', 'districts.id')
            ->orderBy("districts.$property", $direction)
            ->select('agencies.*')
        ;

    }
}
