<?php declare(strict_types=1);

namespace App\Providers;

use App\Search\General;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        General::bootSearchable();
        
        // case-insensitive unique validation https://stackoverflow.com/a/61008858
        // also note the custom error message in resources/lang/en/validation.php
        Validator::extend('iunique', function ($attribute, $value, $parameters, $validator) {
            $query = DB::table($parameters[0]);
            $column = $query->getGrammar()->wrap($parameters[1] ?? $attribute);
            $ignoreId = $parameters[2] ?? null;
            $result = $ignoreId
                ? $query->whereRaw("lower({$column}) = lower(?) and id != ?", [$value, $ignoreId])
                : $query->whereRaw("lower({$column}) = lower(?)", [$value]);
            return !$result->count();
        });

        // case-insensitive exists validation https://laracasts.com/discuss/channels/laravel/validation-exists-case-insensitive
        // also note the custom error message in resources/lang/en/validation.php
        Validator::extend('iexists', function ($attribute, $value, $parameters, $validator) {
            $query = DB::table($parameters[0]);
            $column = $query->getGrammar()->wrap($parameters[1]);

            return $query->whereRaw("lower({$column}) = lower(?)", [$value])->count();
        });
    }
}
