<?php

use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('notes')->name('notes.')->group(function () {
    Route::get('/', [NoteController::class, 'index'])->name('index');
    Route::post('/', [NoteController::class, 'store'])->name('store');
    Route::put('/{note}', [NoteController::class, 'update'])->name('update');
    Route::patch('/{note}/pin', [NoteController::class, 'togglePin'])->name('pin');
    Route::delete('/{note}', [NoteController::class, 'destroy'])->name('destroy');
});