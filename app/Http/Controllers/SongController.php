<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\User;
use App\Notifications\SongPending;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

use function PHPUnit\Framework\isEmpty;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $order = $request->query('order');
        $field = $request->query('field');
        $perPage = (int)$request->query('per_page');
        $statusId = $request->query('status_id');
        if ($order == null || $field == null || $perPage == null) {
            $songs = Song::all();
        } else if ($statusId !== null) {
            $songs = Song::where('song_status_id', $statusId)->orderBy($field, $order)->paginate($perPage);
        } else
            $songs = Song::orderBy($field, $order)->paginate($perPage);
        foreach ($songs as $song) {
            $total = DB::table('user_song_actions')
                ->where('song_id', '=', $song->id)
                ->where('action_type_id', '=', 2)
                ->count();
            $account = User::find($song->upload_by);
            $song->artists;
            $song->views = $total;
            $song->upload_by = $account;
        }
        return $songs;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function upload(Request $request)
    {


        try {
            $user = Auth::user();

            if ($request->file('imageFile')) {
                $imageFile = $request->file('imageFile');
                $imageName = time() . '.' . $imageFile->extension();
            }

            if ($request->file('songFile')) {
                $songFile = $request->file('songFile');
                $songName = time() . '.' . $songFile->extension();
            }

            $arrayID = $request->artistsID;
            $artistID = array_map('intval', $arrayID);

            date_default_timezone_set("Asia/Ho_Chi_Minh");

            $seconds = $request->duration;
            $hours = floor($seconds / 3600);
            $minutes = floor(($seconds % 3600) / 60);
            $seconds = $seconds % 60;
            $duration = Carbon::createFromTime($hours, $minutes, $seconds);

            $song = Song::create([
                'name' => $request->name,
                'image' => $imageName,
                'lyrics' => $request->lyrics,
                'description' => $request->description,
                'duration' => $duration,
                'link' => $songName,
                'upload_by' => (int)$user->id,
                'song_status_id' => 3,
                'updated_at' => date("Y/m/d H:i:s"),
            ]);

            $song->artists()->attach($artistID);

            if ($song) {
                $songPath = public_path() . '/storage/songs';
                $songFile->move($songPath, $songName);

                $imagePath = public_path() . '/storage/images';
                $imageFile->move($imagePath, $imageName);

                Auth::user()->notify(new SongPending($song));
                $admins = User::role('Admin')->get();
                Notification::send($admins, new SongPending(($song)));
            }

            return response()->json($song);
        } catch (\Throwable $th) {
            return $th;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $song = Song::find($id);
        return response()->json($song);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function artists(string $id)
    {
        $songs = Song::findOrFail($id);
        $artists = $songs->artists;
        return response()->json($artists);
    }

    public function follow(Request $request)
    {
        try {

            $userId = Auth::id();
            $songId = (int)$request->songId;


            date_default_timezone_set("Asia/Ho_Chi_Minh");

            DB::table('user_song_actions')->insert([
                'user_id' => $userId,
                'song_id' => $songId,
                'created_at' => date("Y/m/d H:i:s"),
                'action_type_id' => 2,
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Follow success songId' . $songId,
                'user' => $userId,
                'song' => $songId,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th
            ], 500);
        }
    }

    public function unfollow(Request $request)
    {
        try {
            $userId = Auth::id();
            $songId = (int)$request->songId;
            DB::table('user_song_actions')->where([
                'user_id' => $userId,
                'song_id' => $songId,
                'action_type_id' => 3,
            ])->delete();
            return response()->json([
                'status' => true,
                'message' => 'Delete success follow song Id: ' . $songId,
                'user' => $userId,
                'song' => $songId,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error. Try later'
            ], 500);
        }
    }

    public function isFollow(string $id)
    {
        try {
            $userId = Auth::id();
            $songId = (int)$id;
            if (DB::table('user_song_actions')->where([
                ['song_id', '=', $songId],
                ['user_id', '=', $userId],
                ['action_type_id', '=', 3]
            ])->exists()) {
                return response()->json([
                    'songId' => $songId,
                ]);
            }
            return response()->json([
                'songId' => null,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error. Try later'
            ], 500);
        }
    }

    public function getFollowSongs()
    {
        //get user id
        $userId = Auth::id();

        //take only song id colume
        $table = DB::table('user_song_actions')->where([
            ['user_id', '=', $userId],
            ['action_type_id', '=', 3],
        ])->orderBy('created_at', 'DESC')->get(['song_id', 'created_at']);

        $data = [];
        //add song information
        foreach ($table as $row) {
            $song = Song::where('id', $row->song_id)->first();
            array_push($data, $song);
        }

        //Get array of song id
        $songIds = array();
        foreach ($table as $item) {
            array_push($songIds, $item->song_id);
        }
        //add artist infor and timestamp
        foreach ($data as $datum) {
            $datum->artists;
            foreach ($table as $item) {
                if ($datum->id === $item->song_id) {
                    $datum->action_at = $item->created_at;
                }
            }
        }

        return $data;
    }

    public function statuses()
    {
        $table = DB::table('song_statuses')->get();
        foreach ($table as $row) {
            $count = Song::where('song_status_id', $row->id)->count();
            $row->total = $count;
        }
        return response()->json($table);
    }

    public function nextSong(Request $request)
    {
        $currentSongId = $request->id;
        return $currentSongId;
    }

    public function stream(Request $request)
    {
        try {
            $userId = Auth::id();
            $songId = $request->id;
            $duration = $request->duration;

            //add stream data
            $stream = DB::table('user_song_actions')->insert([
                'user_id' => $userId,
                'song_id' => $songId,
                'duration' => $duration,
                'created_at' => date("Y/m/d H:i:s"),
                'action_type_id' => 2,
            ]);
            //add recently stream
            $history = DB::table('user_song_actions')
                ->where('user_id', '=', $userId)
                ->where('song_id', '=', $songId)
                ->where('action_type_id', '=', 3)
                ->get();

            if (count($history) == 0) {
                DB::table('user_song_actions')->insert([
                    'user_id' => $userId,
                    'song_id' => $songId,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'action_type_id' => 3,
                ]);
            } else {
                DB::table('user_song_actions')
                    ->where('user_id', '=', $userId)
                    ->where('song_id', '=', $songId)
                    ->where('action_type_id', '=', 3)->delete();

                DB::table('user_song_actions')->insert([
                    'user_id' => $userId,
                    'song_id' => $songId,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'action_type_id' => 3,
                ]);
            }
            return 'Add success';
        } catch (\Throwable $th) {
            return response()->json('System ERR');
        }
    }

    public function streams(Request $request)
    {
        $songId = $request->query('song-id');
        $total = DB::table('user_song_actions')
            ->where('song_id', '=', $songId)
            ->where('action_type_id', '=', 2)
            ->count();

        return response()->json($total);
    }
}
