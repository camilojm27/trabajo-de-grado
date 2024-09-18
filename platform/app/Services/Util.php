<?php

namespace App\Services;

use App\Models\Container;
use App\Models\TempHash;
use Illuminate\Support\Str;

class Util
{
    public static function generateHashToContainer(Container $container, string $action): TempHash
    {
        $hash = Str::random(64);
        $expiresAt = now()->addMinutes(15);

        return TempHash::create([
            'container_id' => $container->id,
            'hash' => $hash,
            'action' => $action,
            'expires_at' => $expiresAt,
        ]);
    }

    public static function getServerLocalIP(): string
    {
        return gethostbyname(gethostname());
    }
}
