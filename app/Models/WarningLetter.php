<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarningLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'letter_number',
        'date',
        'reason',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
