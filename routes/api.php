<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

Route::apiResource('students', StudentController::class);
Route::apiResource('attendances', AttendanceController::class)->only(['index', 'store']);
