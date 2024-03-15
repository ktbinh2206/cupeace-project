<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function user(Request $request)
    {
        $user = Auth::user();
        $unreadNotifications = $user->unreadNotifications->count();
        $user->unRead = $unreadNotifications;
        return response()->json([
            'total' => $unreadNotifications,
            'data' => $user->notifications
        ]);
    }

    public function read(Request $request)
    {
        $user = Auth::user();
        $notifications = $request->query('id');
        foreach ($user->unreadNotifications  as $notification) {
            if (strcmp($notifications, $notification->id)) {
                $notification->markAsRead();
                return $notification;
            }
        }
    }
}
