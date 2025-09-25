<?php

use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\MesocycleController;
use App\Http\Controllers\WorkoutController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('exercises', ExerciseController::class);
    Route::resource('mesocycles', MesocycleController::class);
    Route::get('/workout/start', [WorkoutController::class, 'start']);
    Route::get('/workout/begin', [WorkoutController::class, 'begin']);
    Route::get('/workout/active', [WorkoutController::class, 'active']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
