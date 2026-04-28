<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachingNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'date',
        'note',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
