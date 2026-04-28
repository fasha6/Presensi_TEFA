<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(): JsonResponse
    {
        $attendances = Attendance::query()
            ->with('student:id,name,nis,class_name,major')
            ->latest('date')
            ->latest('lesson_hour')
            ->get()
            ->map(fn (Attendance $attendance): array => $this->serializeAttendance($attendance));

        return response()->json($attendances);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'date' => ['required', 'date'],
            'lesson_hour' => ['required', 'integer', 'min:1', 'max:20'],
            'subject' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:hadir,telat,alpha,izin,sakit'],
            'note' => ['nullable', 'string'],
        ]);

        $attendance = Attendance::query()->create([
            ...$validated,
            'created_by' => 'demo-user',
        ]);

        return response()->json(
            $this->serializeAttendance($attendance->load('student:id,name,nis,class_name,major')),
            201
        );
    }

    private function serializeAttendance(Attendance $attendance): array
    {
        return [
            'id' => $attendance->id,
            'student_id' => $attendance->student_id,
            'student' => $attendance->student ? [
                'id' => $attendance->student->id,
                'name' => $attendance->student->name,
                'nis' => $attendance->student->nis,
                'class' => $attendance->student->class_name,
                'jurusan' => $attendance->student->major,
            ] : null,
            'date' => $attendance->date,
            'lesson_hour' => $attendance->lesson_hour,
            'subject' => $attendance->subject,
            'status' => $attendance->status,
            'note' => $attendance->note,
            'created_by' => $attendance->created_by,
            'created_at' => $attendance->created_at,
            'updated_at' => $attendance->updated_at,
        ];
    }
}
