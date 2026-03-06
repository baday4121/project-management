<?php

use App\Http\Controllers\TaskLabelController;
use Illuminate\Support\Facades\Route;

Route::prefix('projects/{project}')->name('project.')->group(function () {
    Route::get('/labels', [TaskLabelController::class, 'index'])->name('labels.index');
    Route::get('/labels/create', [TaskLabelController::class, 'create'])->name('labels.create');
    Route::post('/labels', [TaskLabelController::class, 'store'])->name('labels.store');
    Route::get('/labels/{label}/edit', [TaskLabelController::class, 'edit'])->name('labels.edit');
    Route::put('/labels/{label}', [TaskLabelController::class, 'update'])->name('labels.update');
    Route::delete('/labels/{label}', [TaskLabelController::class, 'destroy'])->name('labels.destroy');
});