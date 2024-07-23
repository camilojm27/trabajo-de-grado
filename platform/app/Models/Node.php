<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Node extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = ['name', 'hostname', 'ip_address',  'attributes', 'created_by'];

    protected $casts = [
        'attributes' => 'json',
    ];
    // Append isOnline attribute to the model
    protected $appends = ['isOnline'];

    public function getIsOnlineAttribute(): bool
    {
        return $this->isOnline();
    }

    /**
     * The users that belong to the node.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'nodes_users');
    }

    /**
     * The user that created the node.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function containers(): HasMany
    {
        return $this->hasMany(Container::class);
    }
    /**
     * The user that created the node.
     */
    public function isOnline(): bool
    {
        return Cache::has('node-online-' . $this->id);
    }
}
