<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateWithToken
{
    /**
     * Allow request only if the API token is set, and matches the token
     * sent in the request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $token = config('auth.api_token');
        if (empty($token) || ($request->header('X-API-Token') !== $token)) {
            abort(403);
        }

        return $next($request);
    }
}
