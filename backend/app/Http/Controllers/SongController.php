<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Song;
use App\Models\User;
use App\Notifications\SongPending;
use App\Notifications\SongStatusUpdate;
use App\Services\RecommendationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;


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
            if ($statusId !== null) {
                $songs = Song::where('song_status_id', $statusId)->get();
            } else
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
            $song->categories;
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
            $imageName = time() . '.' . $request->file('imageFile')->extension();
            $songName = time() . '.' . $request->file('songFile')->extension();
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

            $song->artists()->attach($request->artistsID);
            $song->categories()->attach($request->categoriesID);

            $songPath = public_path() . '/storage/songs';
            $imagePath = public_path() . '/storage/images';

            // Move uploaded files with better error handling
            $movedImage = $request->file('imageFile')->move($imagePath, $imageName);
            $movedSong = $request->file('songFile')->move($songPath, $songName);

            if (!$movedImage || !$movedSong) {
                throw new \Exception('Failed to move uploaded files.');
            }

            //Send notification to upload user
            Auth::user()->notify(new SongPending($song));

            //Send to Admin
            $admins = User::role('Admin')->get();
            Notification::send($admins, new SongPending(($song)));

            return response()->json($song);
        } catch (\Throwable $th) {
            DB::table('artist_have_songs')->where('song_id', $song->id)->delete();
            $song->delete();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $song = Song::find($id);
        $song->artists;
        $song->views = $song->views();
        return $song;
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
                'action_type_id' => 3,
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

    public function formatDuration($duration)
    {
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
                ->where('action_type_id', '=', 1)
                ->get();

            if (count($history) == 0) {
                DB::table('user_song_actions')->insert([
                    'user_id' => $userId,
                    'song_id' => $songId,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'action_type_id' => 1,
                ]);
            } else {
                DB::table('user_song_actions')
                    ->where('user_id', '=', $userId)
                    ->where('song_id', '=', $songId)
                    ->where('action_type_id', '=', 1)->delete();

                DB::table('user_song_actions')->insert([
                    'user_id' => $userId,
                    'song_id' => $songId,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'action_type_id' => 1,
                ]);
            }
            return 'Add success';
        } catch (\Throwable $th) {
            return response()->json('System ERR', 500);
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

    public function updateStatus(Request $request)
    {
        $statusId = $request->input('status-id');
        $songs = $request->songs;
        $status = '';
        switch ($statusId) {
            case 1:
                $status = 'Public';
                break;
            case 2:
                $status = 'Private';
                break;
            case 3:
                $status = 'Pending';
                break;
            case 4:
                $status = 'Banned';
                break;
            default:
                $status = '';
                break;
        }
        foreach ($songs as $song) {
            $users = User::find($song['upload_by']);
            Song::find($song['id'])
                ->update(['song_status_id' => $statusId]);
            foreach ($users as $user) {
                Notification::send(
                    User::find($user->id),
                    new SongStatusUpdate(Song::find($song['id']), $song['name'] . '\'s status has been update to ' . $status)
                );
            }
        }
        return $songs;
    }

    // This function will send data to fronend to:
    // serve homepage display
    public function homeForLoginedUser(Request $request)
    {
        $userId = Auth::id();

        $recentlyId = DB::table('user_song_actions')
            ->where('user_id', '=', $userId)
            ->where('action_type_id', '=', 1)
            ->take(9)
            ->orderBy('created_at', 'desc')
            ->get(['song_id', 'created_at']);

        $recentlySongs = [];
        foreach ($recentlyId as $id) {
            $song = Song::find($id->song_id); // Access song_id property of $id
            $song->load('artists'); // Eager load artists relationship
            $recentlySongs[] = $song; // Append song to array
        }

        //Popular Songs
        $popularSongs = Song::where('song_status_id', 1)->get();
        foreach ($popularSongs as $song) {
            $song->artists;
            $song->views = $song->views();
        }
        $popularSongs = $popularSongs->sortByDesc('views')->take(9)->values();

        //Popular Artists
        $artists = Artist::all();
        foreach ($artists as $artist) {
            $artist->views = $artist->totalViews();
        }
        $popularArtists = $artists->sortByDesc('views')->take(9)->values();

        $data = (object)[
            "recently_songs" => $recentlySongs,
            "popular_artists" => $popularArtists,
            "popular_songs" => $popularSongs,
        ];
        return $data;
    }

    public function homeForGuest(Request $request)
    {

        //Recently Songs
        $songs = Song::where('song_status_id', 1)->take(9)->get();
        foreach ($songs as $song) {
            $song->artists;
            $song->views = $song->views();
        }

        $songs = $songs->sortByDesc('views')->values();

        return response()->json([
            'popular_songs' => $songs
        ]);
    }

    public function getPlaylist(Request $request)
    {
        // Validate song ID (optional)
        // $request->validate(['songId' => 'required|integer']);
        $songId = $request->query('songId');
        // Retrieve song data from database
        $song = Song::find($songId);

        // Check if song exists
        if (!$song) {
            return response()->json(['error' => 'Song not found'], 404);
        }
        // Generate playlist using recommendation service
        $playlist = RecommendationService::generatePlaylist($song);

        // Return playlist data as JSON response
        return response()->json([
            'playlist' => $playlist,
        ]);
    }

    public function logStream(Request $request)
    {
        try {
            $songId = $request->songId;
            $duration = gmdate("H:i:s", round($request->duration));
            $streamingSession = $request->streamingSession;
            $userId = Auth::id();
            DB::table('streaming_logs')->insert([
                [
                    'song_id' => $songId,
                    'user_id' => $userId,
                    'streaming_session' => $streamingSession,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'updated_at' => date("Y/m/d H:i:s"),
                ]
            ]);
            //add recently stream
            $history = DB::table('user_song_actions')
                ->where('user_id', '=', $userId)
                ->where('song_id', '=', $songId)
                ->where('action_type_id', '=', 1)
                ->get();

            if (count($history) == 0) {
                DB::table('user_song_actions')->insert([
                    'user_id' => $userId,
                    'song_id' => $songId,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'action_type_id' => 1,
                ]);
            } else {
                DB::table('user_song_actions')
                    ->where('user_id', '=', $userId)
                    ->where('song_id', '=', $songId)
                    ->where('action_type_id', '=', 1)->delete();

                DB::table('user_song_actions')->insert([
                    'user_id' => $userId,
                    'song_id' => $songId,
                    'duration' => $duration,
                    'created_at' => date("Y/m/d H:i:s"),
                    'action_type_id' => 1,
                ]);
            }
            return response()->json(
                [
                    'song' => $songId,
                    'duration' => $duration,
                    'session' => $streamingSession,
                ]
            );
        } catch (\Throwable $th) {
            // Log the error and return an appropriate response
            Log::error($th->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}
