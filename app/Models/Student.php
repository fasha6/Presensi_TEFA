<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
