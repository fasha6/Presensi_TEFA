<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WarningLetter;

class WarningLetterController extends Controller
{
    public function index()
    {
        return WarningLetter::with('student')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'letter_number' => 'required|string|unique:warning_letters,letter_number',
            'date' => 'required|date',
            'reason' => 'required|string',
        ]);
        $warningLetter = WarningLetter::create($validated);
        return response()->json($warningLetter->load('student'), 201);
    }
}