<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    public function test()
    {
        $data = DB::table('streaming_logs')
            ->select(DB::raw('*, ROW_NUMBER() OVER (PARTITION BY user_id, streaming_session ORDER BY created_at DESC) AS row_num'))
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(['user_id', 'streaming_session'])
            ->map(function ($group, $user_id) {
                return [
                    'user_id' => $user_id,
                    'sessions' => $group->slice(1)->values()->all()
                ];
            })
            ->values();
        $result = [];
        foreach ($data as $datum) {
            //sessions of each user
            $sessions = $datum['sessions'];
            //each sessions of user
            foreach ($sessions as $session) {
                //the max duration of each sessions
                array_push($result, $session[0]);
            }
        }
        foreach ($result as $action) {

            DB::table('user_song_actions')->insert([
                'user_id' => $action->user_id,
                'song_id' => $action->song_id,
                'duration' => $action->duration,
                'created_at' => $action->created_at,
                'action_type_id' => 2,
            ]);
        }

        DB::table('streaming_logs')
            ->select(DB::raw('*, ROW_NUMBER() OVER (PARTITION BY user_id, streaming_session ORDER BY created_at DESC) AS row_num'))
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(['user_id', 'streaming_session'])
            ->each(function ($group) {
                $group->slice(1)->values()->each(function ($sessions) {
                    foreach ($sessions as $session) {
                        DB::table('streaming_logs')
                            ->where('user_id', $session->user_id)
                            ->where('song_id', $session->song_id)
                            ->where('streaming_session', $session->streaming_session)
                            ->delete();
                    }
                });
            });
        return $result;
    }
}
