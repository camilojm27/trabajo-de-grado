<?php

use App\Http\Controllers\ContainerController;
use App\Http\Controllers\ContainerTemplateController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Statistics;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('guest')->name('welcome');

Route::middleware(['auth', 'verified', 'auth.banned'])->group(function () {
    // -------------- Containers Pages ----------------

    Route::get('/containers', [ContainerController::class, 'index'])->name('containers');
    Route::get('/containers/create', [ContainerController::class, 'create'])->name('containers.create');
    Route::post('/containers/store', [ContainerController::class, 'store'])->name('containers.store');
    Route::get('/containers/show/{container}', [ContainerController::class, 'show'])->name('containers.show');
    Route::get('/containers/{node}', [ContainerController::class, 'showNode'])->name('containers.node');

    // -------------- Containers Actions ----------------
    Route::post('/containers/recreate/{container}', [ContainerController::class, 'recreate']);
    Route::post('/containers/restart/{container}', [ContainerController::class, 'restart']);
    Route::post('/containers/start/{container}', [ContainerController::class, 'start']);
    Route::post('/containers/stop/{container}', [ContainerController::class, 'stop']);
    Route::post('/containers/kill/{container}', [ContainerController::class, 'kill']);
    Route::post('/containers/pause/{container}', [ContainerController::class, 'pause']);
    Route::post('/containers/unpause/{container}', [ContainerController::class, 'unpause']);
    Route::post('/containers/delete/{container}', [ContainerController::class, 'destroy']);

    Route::post('/containers/logfile/{container}', [ContainerController::class, 'requestLogFile']);
    // -------------- Containers Realtime Actions ----------------

    Route::post('/containers/metrics/{container}', [ContainerController::class, 'metrics']);
    Route::post('/containers/logs/{container}', [ContainerController::class, 'logs']);

    // -------------- Container Templates ----------------
    Route::get('/container-templates', [ContainerTemplateController::class, 'index'])->name('container-templates.index');
    Route::post('/container-templates', [ContainerTemplateController::class, 'store'])->name('container-templates.store');
    Route::delete('/container-templates/{id}', [ContainerTemplateController::class, 'destroy'])->name('container-templates.destroy');

    // -------------- Node Pages ----------------
    Route::get('/nodes/{id?}', [NodeController::class, 'index'])->name('nodes');
    Route::get('/nodes/show/{node}', [NodeController::class, 'show'])->name('nodeDetail');

    // -------------- Node Actions ----------------
    Route::post('/nodes/metrics/{node}', [NodeController::class, 'metrics']);
    Route::post('/nodes/{node}/users', [NodeController::class, 'addUserToNode']);
    Route::delete('/nodes/{node}/users/{user}', [NodeController::class, 'deleteUserFromNode']);
});

// ------------ Admin ONLY Routes ----------------

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    // ---- Settings routes ---------
    Route::get('/settings/general', [SettingController::class, 'index'])->name('settings.general');
    Route::get('/settings/phpinfo', [SettingController::class, 'phpinfo'])->name('settings.phpinfo');
    Route::get('/phpinfo', [SettingController::class, 'rawPhpinfo']); //This functions sends the data to the iframe
    Route::patch('/settings/action/{id}', [SettingController::class, 'update'])->name('settings.update');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::patch('/users/ban/{user}', [UserController::class, 'ban'])->name('user.ban');
    Route::patch('/users/unban/{user}', [UserController::class, 'unban'])->name('user.unban');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.delete');
});
Route::get('/dashboard', [Statistics::class, 'dashboard'])->name('dashboard');

//--------- Download Files
//Route::get('/download/{$containerID}', function ($containerID)  {
//    $container = Container::findOrFail($containerID);
//
//
//    if (Storage::exists($filePath)) {
//        return Storage::disk('public')->download($filePath);
//    }
//
//    return response()->json(['message' => 'File not found.'], 403);
//})->name('file.download');

//-------------- Laravel Framework Routes---------------------------

//
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

require __DIR__.'/auth.php';
