<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Container extends Model
{
    use HasFactory;

    protected $fillable = ['node_id', 'name', 'image', 'ports', 'node_id', 'state', 'status', 'verified', 'container_id', 'attributes', 'error', 'log_file_path', 'log_download_link', 'log_timestamp'];

    protected $casts = [
        'attributes' => 'json',
        // 'error' => 'json'
    ];

    public function node(): BelongsTo
    {
        return $this->belongsTo(Node::class);
    }

    public function tempHashes(): HasMany
    {
        return $this->hasMany(TempHash::class);
    }
}
