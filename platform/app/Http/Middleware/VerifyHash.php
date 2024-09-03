<?php

namespace App\Http\Middleware;

use App\Models\TempHash;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyHash
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $hash = $request->route('hash');
        $tempHash = TempHash::where('hash', $hash)
            ->where('expires_at', '>', now())
            ->first();

        if (! $tempHash) {
            return response()->json(['error' => 'Invalid or expired hash.'], 403);
        }

        $request->merge(['tempHash' => $tempHash]); // Optional: Pass tempHash to controller

        return $next($request);
    }
}
