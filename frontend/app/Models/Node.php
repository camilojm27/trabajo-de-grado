<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Node extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = ['name', 'hostname', 'ip_address',  'attributes'];

    public function containers(): HasMany
    {
        return $this->hasMany(Container::class);
    }
}
