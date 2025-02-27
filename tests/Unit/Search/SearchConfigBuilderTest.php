<?php declare(strict_types=1);

namespace Tests\Unit\Search;

use Algolia\ScoutExtended\Contracts\SearchableCountableContract;
use App\Models\User;
use App\Search\SearchConfigBuilder;
use Carbon\Carbon;

class SearchConfigBuilderTest extends \Tests\TestCase
{
    public function test_it_restricts_searching_options_for_user_and_highlights_matches() {
        Carbon::setTestNow();

        $mockSearchable = \Mockery::mock(SearchableCountableContract::class);
        $mockSearchable->shouldReceive('searchableAs')
            ->andReturn('test');

        $mockUser = \Mockery::mock(User::class);
        $mockUser->shouldReceive('getSearchableTypes')
            ->andReturn(['foo', 'bar']);

        $builder = new SearchConfigBuilder($mockSearchable, $mockUser);

        $this->assertEquals([
            'validUntil' => Carbon::now()->addSeconds(3600 * 24)->timestamp,
            'restrictIndices' => ['test'],
            'facetFilters' => [['_type:foo', '_type:bar']],
            'highlightPreTag' => '<em>',
            'highlightPostTag' => '</em>',
        ], $builder->keyOptions());
    }
}
