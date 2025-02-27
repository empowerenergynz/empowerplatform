<?php declare(strict_types=1);

namespace App\Search;

use Algolia\ScoutExtended\Contracts\SearchableCountableContract;
use App\Models\User;
use Carbon\Carbon;

class SearchConfigBuilder
{
    public function __construct(protected SearchableCountableContract $searchable, protected User $user)
    {
    }

    public function indexName(): string {
        return $this->searchable->searchableAs();
    }

    public function keyOptions(): array
    {
        // https://www.algolia.com/doc/api-reference/api-methods/generate-secured-api-key/?client=php
        // https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/?client=php
        $facetFilters = array_map(fn ($type) => "_type:$type", $this->user->getSearchableTypes());

        // it's not mentioned in the docs but an empty $facetFilters array is equivalent to no filter
        // so a user with no permissions could search everything.  Need to add a dummy filter.
        if (count($facetFilters) == 0) {
            $facetFilters[] = "_type:_void_";
        }

        return [
            'validUntil' => Carbon::now()->addSeconds(3600 * 24)->timestamp,
            'restrictIndices' => [$this->indexName()],
            'facetFilters' => [$facetFilters],
            'highlightPreTag' => '<em>',
            'highlightPostTag' => '</em>',
        ];
    }
}
