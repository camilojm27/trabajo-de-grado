<?php

use App\Http\Controllers\NodeController;
use App\Http\Controllers\UtilsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('nodes', [NodeController::class, 'store']);

Route::get('nodes/credentials/{node}', [NodeController::class, 'showCredentials']); //Todo: add uuid validation

Route::get('ping', [UtilsController::class, 'ping']);
