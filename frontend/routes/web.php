<?php

use App\Http\Controllers\ContainerController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::resource('containers', ContainerController::class);

Route::get('/dashboard', [ContainerController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/nodes', [NodeController::class, 'index'])->middleware(['auth', 'verified'])->name('nodes');

Route::get('/nodes/{node}', [NodeController::class, 'show'])->middleware(['auth', 'verified'])->name('nodeDetail');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
