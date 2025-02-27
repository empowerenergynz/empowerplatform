<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UsersQuery
{
    private Request $request;

    public function __construct(Request $incomingRequest)
    {
        $this->request = Request::createFrom($incomingRequest);
        $filters = $this->request->get('filter');
        // fix a weird behaviour from spatie-permission
        // to query an array of roles, the package requires an array with a list of ID separated by comma ie : ['1,2']
        if (isset($filters['role'])) {
            $filters['role'] = [implode(',', $filters['role'])];
            $this->request->query->replace(['filter' => $filters]);
        }
    }

    public function __invoke(): QueryBuilder
    {
        return QueryBuilder::for(User::class, $this->request)
            ->with(['roles', 'invitation'])->withTrashed()
            ->allowedFilters([
                AllowedFilter::scope('search'),
                AllowedFilter::scope('role'),
                AllowedFilter::scope('status'),
            ])
            ->defaultSorts(['first_name', 'last_name']);
    }
}

