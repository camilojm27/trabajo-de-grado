<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('containers', function () {
    return true;
});

Broadcast::channel('node-metrics-{node_id}', function ($node_id) {
    return true;
});
