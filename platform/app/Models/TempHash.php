<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TempHash extends Model
{
    use HasFactory;

    protected $fillable = ['hash', 'container_id', 'expires_at', 'action'];

    public function container(): BelongsTo
    {
        return $this->belongsTo(Container::class);
    }
}
