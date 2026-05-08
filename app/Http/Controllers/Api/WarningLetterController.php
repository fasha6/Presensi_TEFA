<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WarningLetter;

class WarningLetterController extends Controller
{
    public function index()
    {
        return WarningLetter::with('student:id,name,class_name')->latest()->get()->map(function($wl) {
        return [
            'id' => $wl->id,
            'letter_number' => $wl->letter_number,
            'type' => $wl->type,
            'date' => $wl->date,
            'reason' => $wl->reason,
            'student_name' => $wl->student->name ?? '-',
            'class' => $wl->student->class_name ?? '-',
        ];
    });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'letter_number' => 'required|string|unique:warning_letters,letter_number',
            'type' => 'required|in:SP1,SP2,SP3',
            'date' => 'required|date',
            'reason' => 'required|string',
        ]);
        $warningLetter = WarningLetter::create($validated);
        return response()->json($warningLetter->load('student'), 201);
    }
}