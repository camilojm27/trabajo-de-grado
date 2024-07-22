<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContainerController;
use App\Http\Controllers\NodeController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// -------------- Containers Pages ----------------

Route::get('/containers', [ContainerController::class, 'index'])->middleware(['auth', 'verified'])->name('containers');
Route::get('/containers/create', [ContainerController::class, 'create'])->middleware(['auth', 'verified'])->name('containers.create');
Route::post('/containers/store', [ContainerController::class, 'store'])->middleware(['auth', 'verified'])->name('containers.store');
Route::get('/containers/show/{container}', [ContainerController::class, 'show'])->middleware(['auth', 'verified'])->name('containers.show');;
Route::get('/containers/{node}', [ContainerController::class, 'showNode'])->middleware(['auth', 'verified'])->name('containers.node');

// -------------- Containers Actions ----------------
Route::middleware('auth')->group(function () {
    Route::post('/containers/recreate/{container}', [ContainerController::class, 'recreate']);
    Route::post('/containers/restart/{container}', [ContainerController::class, 'restart']);
    Route::post('/containers/start/{container}', [ContainerController::class, 'start']);
    Route::post('/containers/stop/{container}', [ContainerController::class, 'stop']);
    Route::post('/containers/kill/{container}', [ContainerController::class, 'kill']);
    Route::post('/containers/pause/{container}', [ContainerController::class, 'pause']);
    Route::post('/containers/unpause/{container}', [ContainerController::class, 'unpause']);
    Route::post('/containers/delete/{container}', [ContainerController::class, 'destroy']);

    Route::post('/containers/metrics/{container}', [ContainerController::class, 'metrics']);
});

// -------------- Node Actions ----------------
Route::middleware('auth')->group(function () {
    Route::post('/nodes/metrics/{node}', [NodeController::class, 'metrics']);
});

//Route::get('/config', [ConfigurationController::class, 'edit'])->middleware(['auth', 'verified'])->name('config.edit');
Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/nodes', [NodeController::class, 'index'])->middleware(['auth', 'verified'])->name('nodes');

Route::get('/nodes/{node}', [NodeController::class, 'show'])->middleware(['auth', 'verified'])->name('nodeDetail');

// Laravel Routes
// The Email Verification Notice

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

// The Email Verification Handler
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

//Resending the Verification Email
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message',
        'Verification link sent!'
    );
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
