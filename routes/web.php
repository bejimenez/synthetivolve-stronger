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
    Route::patch('mesocycles/{mesocycle}/training-days/{trainingDay}', [MesocycleController::class, 'updateTrainingDay'])
        ->name('mesocycles.training-days.update');
    Route::post('mesocycles/{mesocycle}/training-days/{trainingDay}/second-session', [MesocycleController::class, 'addSecondSession'])
        ->name('mesocycles.training-days.add-second-session');
    Route::delete('mesocycles/{mesocycle}/training-days/{trainingDay}/second-session', [MesocycleController::class, 'removeSecondSession'])
        ->name('mesocycles.training-days.remove-second-session');
    
    Route::post('mesocycles/{mesocycle}/training-days/{trainingDay}/exercises', [MesocycleController::class, 'addExercise'])
        ->name('mesocycles.exercises.add');
    Route::patch('mesocycles/{mesocycle}/planned-exercises/{plannedExercise}', [MesocycleController::class, 'updateExercise'])
        ->name('mesocycles.exercises.update');
    Route::delete('mesocycles/{mesocycle}/planned-exercises/{plannedExercise}', [MesocycleController::class, 'removeExercise'])
        ->name('mesocycles.exercises.remove');
    Route::post('mesocycles/{mesocycle}/reorder-exercises', [MesocycleController::class, 'reorderExercises'])
        ->name('mesocycles.exercises.reorder');
    
    Route::post('mesocycles/{mesocycle}/weeks/{week}/duplicate', [MesocycleController::class, 'duplicateWeek'])
        ->name('mesocycles.weeks.duplicate');
    Route::get('/workout/start', [WorkoutController::class, 'start']);
    Route::get('/workout/begin', [WorkoutController::class, 'begin']);
    Route::get('/workout/active', [WorkoutController::class, 'active']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
