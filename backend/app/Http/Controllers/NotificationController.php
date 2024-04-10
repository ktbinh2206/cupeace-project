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
        foreach ($user->unreadNotifications  as $notification) {
            $notification->markAsRead();
        }
    }
}
