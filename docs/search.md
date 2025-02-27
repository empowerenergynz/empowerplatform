# Global Search Feature

The global search is built using [Algolia](https://www.algolia.com/).

## Architecture

We are providing a single global search index for all record types. At time of writing that includes:

- users
- donations

Not all user roles have permission to view all record types. The `getSearchableTypes` method on the `User` model 
controls which types are available to each user.

The search index is configured using [Laravel Scout](https://laravel.com/docs/8.x/scout) with the Algolia first-party [extension library](https://www.algolia.com/doc/framework-integration/laravel/getting-started/introduction-to-scout-extended/?client=php).

By default, Laravel Scout does not allow multiple model types to share a search index, so we are using the [aggregation feature](https://www.algolia.com/doc/framework-integration/laravel/advanced-use-cases/multiple-models-in-one-index/?client=php) provided by the Algolia extension.

We provide the search interface using Algolia's first-party [React Instantsearch Hooks](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react-hooks/) library. Note that the docs state that the library in not production-ready, but this [comment](https://github.com/algolia/react-instantsearch/issues/2870#issuecomment-1016413105) states that it will be the main React implementation for Algolia, so it seems worth using to avoid having to migrate later.

To keep our API credentials secure when performing client side search, we generate a [secured API key](https://www.algolia.com/doc/api-reference/api-methods/generate-secured-api-key/) in Laravel and share this with the frontend using the Inertia middleware. The secured API key for each user is cached for 24 hours. If you change the search key config, remember to clear the Laravel cache before testing the search or Algolia will return a 'forbidden' response.

## Configuration

Five environment variables are available for configuring the index:

- ALGOLIA_APP_ID
- ALGOLIA_SECRET
- ALGOLIA_SEARCH_KEY
- SCOUT_PREFIX
- SCOUT_QUEUE
- SCOUT_DRIVER

The app ID, secret and search key (used for generating secured API keys) are available in the Algolia console

The scout prefix enables us to provide a per environment prefix for the search index.

The scout queue variable controls whether updates to searchable models are applied to the index synchronously or via the queue. This should always be "TRUE" in test and production environments.

To configure your local development environment, add the app ID, secret and search key to your `.env` file. Then copy the `config/algolia/scout-local-general.php.example` file to `config/algolia/scout-{$YOUR_NAME}-local-general.php`. See [the Algolia docs](https://www.algolia.com/doc/framework-integration/laravel/indexing/configure-index/?client=php) for configuration options.

Once you have created your configuration, run `artisan scout:sync` to update these settings in Algolia then clear the Laravel cache with `artisan cache:clear`.

## Helpful commands during DEV
* `artisan scout:flush` to flush your index.
* `artisan scout:reimport` to re-index items from your database (or `npm run data:search-sync`).

## Adding new models / searchable attributes
If you add any new models to the app or add a searchable attributes to an existing model:
* Add `use Searchable;` and `toSearchableArray()` in the PHP model class.
* Add the model class to `app\Search\General.php`.
* Add the new model to `getSearchableTypes()` in `Models/User.php` with the appropriate permissions.
* Add any new attributes to `searchableAttributes[]` in all the files in `config/algolia`.
* Clear the Laravel cache with `artisan cache:clear`.
* Run `artisan scout:reimport` to re-index items from your database.
* To display the search results, add the icon and link definition for the Model to `SearchResult.tsx`.

## Deployment

The deployment script has been modified to run `artisan scout:sync` during deployment, so any changes to the test or production config files should be automatically reflected on release.

If you add or remove attributes from the index, you may need to also run `artisan scout:import` via the AWS CLI for ECS or similar.
