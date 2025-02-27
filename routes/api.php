<?php declare(strict_types=1);

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public API
Route::middleware('api')->group(function () {
    Route::prefix('v1')->group(function () {
    });
});

Route::middleware('web')->group(function () {
    Route::middleware('auth:web')->group(function () {
        Route::get('/{all}', fn() => abort(404, 'Route not found'))->where('all', '.*');
    });
});
