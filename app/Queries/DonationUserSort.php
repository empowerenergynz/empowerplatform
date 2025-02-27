<?php declare(strict_types=1);

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class DonationUserSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->leftJoin('users', 'donations.user_id', '=', 'users.id');
        if ($property == 'name') {
            $query->orderByRaw("first_name || ' ' || last_name $direction");
        } else {
            $query->orderBy("users.$property", $direction);
        }
        $query->select('donations.*');
    }
}
