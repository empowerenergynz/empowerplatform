<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Donation;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class DonationsQuery
{
    public function __construct(private Request $request)
    {
    }

    public function __invoke(): QueryBuilder
    {
        $donorSort = AllowedSort::custom('donor', new DonationUserSort(), 'name');
        return QueryBuilder::for(Donation::class, $this->request)
            ->allowedSorts([
                $donorSort,
                'amount',
            ])
            ->defaultSort($donorSort);

    }
}
