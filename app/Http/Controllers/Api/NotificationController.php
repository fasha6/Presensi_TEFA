<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
            'target_role' => 'required|string',
            'student_id' => 'nullable|integer',
        ]);

        $notification = Notification::create($validated);

        return response()->json($notification);
    }

    public function markAsRead($id)
    {
        $notif = Notification::findOrFail($id);

        $notif->update([
            'is_read' => true
        ]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function createAlphaNotification($studentId, $alphaCount)
    {
        if ($alphaCount == 1) {
            Notification::create([
                'title' => 'Alpha 1x',
                'message' => 'Siswa tidak hadir tanpa keterangan',
                'type' => 'alpha',
                'target_role' => 'parent',
                'student_id' => $studentId,
            ]);
        }

        if ($alphaCount == 3) {
            Notification::create([
                'title' => 'Alpha 3x',
                'message' => 'Siswa sudah alpha 3x',
                'type' => 'alpha',
                'target_role' => 'parent',
                'student_id' => $studentId,
            ]);

            Notification::create([
                'title' => 'Alpha 3x',
                'message' => 'Siswa sudah alpha 3x',
                'type' => 'alpha',
                'target_role' => 'teacher',
                'student_id' => $studentId,
            ]);
        }

        if ($alphaCount == 4) {
            Notification::create([
                'title' => 'Alpha 4x',
                'message' => 'Siswa perlu penanganan BK',
                'type' => 'alpha',
                'target_role' => 'bk',
                'student_id' => $studentId,
            ]);
        }
    }
}