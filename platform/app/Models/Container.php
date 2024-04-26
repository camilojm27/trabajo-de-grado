<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Container extends Model
{
    use HasFactory;

    protected $fillable = ['node_id', 'name', 'image', 'ports', 'node_id', 'state', 'status', 'verified', 'container_id', 'attributes', 'error'];

    protected $casts = [
        'attributes' => 'json',
       // 'error' => 'json'
    ];

    public function node(): BelongsTo
    {
        return $this->belongsTo(Node::class);
    }

}
