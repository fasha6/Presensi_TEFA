<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\WarningLetterController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::apiResource('students', StudentController::class);
Route::apiResource('attendances', AttendanceController::class)->only(['index', 'store']);
Route::apiResource('warning-letters', WarningLetterController::class);
Route::apiResource('notifications', NotificationController::class);
