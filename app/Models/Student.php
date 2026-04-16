<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'nis',
        'name',
        'class_name',
        'major',
        'attendance_percentage',
        'violations_count',
        'warning_letters_count',
        'risk_level',
        'parent_name',
        'parent_phone',
    ];
}
