<?php

use App\Http\Controllers\ContainerController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\UtilsController;
use App\Http\Middleware\VerifyHash;
use Illuminate\Support\Facades\Route;

Route::post('nodes', [NodeController::class, 'store'])->middleware('throttle:60,1');

Route::get('nodes/credentials/{node}', [NodeController::class, 'showCredentials'])->middleware('throttle:60,1');
Route::post('/logs/upload/{hash}', [ContainerController::class, 'uploadLogFile'])->middleware(['throttle:60,1', VerifyHash::class]);

Route::get('ping', [UtilsController::class, 'ping'])->middleware('throttle:10,1');
