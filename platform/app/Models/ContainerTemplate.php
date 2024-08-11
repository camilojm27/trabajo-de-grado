<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContainerTemplate extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'configuration', 'user_id'];

    protected $casts = [
        'configuration' => 'array',
    ];
}
