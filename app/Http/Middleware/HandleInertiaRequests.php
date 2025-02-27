<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Algolia\AlgoliaSearch\SearchClient;
use App\Search\General;
use App\Search\SearchConfigBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param \Illuminate\Http\Request $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $searchConfigBuilder = new SearchConfigBuilder(new General(), $user);
            $searchConfig = [
                'searchKey' => Cache::remember(
                    "user-$user->id-search-key",
                    3600 * 24,
                    // https://www.algolia.com/doc/api-reference/api-methods/generate-secured-api-key/?client=php
                    fn () => SearchClient::generateSecuredApiKey(
                        config('scout.algolia.search_key'),
                        $searchConfigBuilder->keyOptions()
                    ),
                ),
                'searchIndex' => $searchConfigBuilder->indexName(),
            ];
        }

        return array_merge(parent::share($request), $searchConfig ?? [], [
            'authUser' => $user
                ? array_merge(
                    $user->toArray(),
                    ['permissions' => $user->getAllPermissions()->pluck('name')->all()],
                )
                : null,
            'flash' => $request->session()->get('messages'),
            'appName' => config('app.name'),
        ]);
    }
}
