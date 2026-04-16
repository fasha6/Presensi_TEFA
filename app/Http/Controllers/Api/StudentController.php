<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(): JsonResponse
    {
        $students = Student::query()
            ->orderBy('class_name')
            ->orderBy('name')
            ->get()
            ->map(fn (Student $student): array => $this->serializeStudent($student));

        return response()->json($students);
    }

    public function store(Request $request): JsonResponse
    {
        $student = Student::query()->create($this->validatedData($request));

        return response()->json($this->serializeStudent($student), 201);
    }

    public function show(Student $student): JsonResponse
    {
        return response()->json($this->serializeStudent($student));
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $student->update($this->validatedData($request, $student));

        return response()->json($this->serializeStudent($student->refresh()));
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json(null, 204);
    }

    private function validatedData(Request $request, ?Student $student = null): array
    {
        return $request->validate([
            'nis' => ['required', 'string', 'max:50', Rule::unique('students', 'nis')->ignore($student)],
            'name' => ['required', 'string', 'max:255'],
            'class_name' => ['required', 'string', 'max:100'],
            'major' => ['required', 'string', 'max:100'],
            'attendance_percentage' => ['required', 'integer', 'min:0', 'max:100'],
            'violations_count' => ['required', 'integer', 'min:0'],
            'warning_letters_count' => ['required', 'integer', 'min:0'],
            'risk_level' => ['required', Rule::in(['low', 'medium', 'high'])],
            'parent_name' => ['nullable', 'string', 'max:255'],
            'parent_phone' => ['nullable', 'string', 'max:30'],
        ]);
    }

    private function serializeStudent(Student $student): array
    {
        return [
            'id' => $student->id,
            'name' => $student->name,
            'nis' => $student->nis,
            'class' => $student->class_name,
            'jurusan' => $student->major,
            'attendancePercentage' => $student->attendance_percentage,
            'violations' => $student->violations_count,
            'sp' => $student->warning_letters_count,
            'riskLevel' => $student->risk_level,
            'parentName' => $student->parent_name,
            'parentPhone' => $student->parent_phone,
        ];
    }
}
