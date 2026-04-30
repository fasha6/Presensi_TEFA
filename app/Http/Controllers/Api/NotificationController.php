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

    // 🔹 Simpan notifikasi baru
    public function store(Request $request)
    {
        $notification = Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'target_role' => $request->target_role,
            'student_id' => $request->student_id,
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
}
