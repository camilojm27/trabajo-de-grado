<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('containers', function () {
    return true;
});

Broadcast::channel('container-metrics{container_id}', function () {
    return true;
});
