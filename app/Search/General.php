<?php declare(strict_types=1);

namespace App\Search;

use Algolia\ScoutExtended\Searchable\Aggregator;

class General extends Aggregator
{
    // was using "algolia/scout-extended": "^1.20",
    // but getting this error when deleting models: https://github.com/algolia/scout-extended/issues/282
    // upgrading to 1.20.2 or 2.20.2 didn't seem to work
    //   https://github.com/algolia/scout-extended/issues/282
    //   https://github.com/algolia/scout-extended/pull/287
    //   https://github.com/algolia/scout-extended/pull/303
    // downgrading laravel/scout to 9.0.0 worked ! (was on 9.4.5)
    //   https://github.com/algolia/scout-extended/issues/282#issuecomment-878523121

    /**
     * The names of the models that should be aggregated.
     *
     * @var string[]
     */
    protected $models = [
//        User::class,
//        Donation::class,
    ];

}
