<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\SongList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SongListController extends Controller
{

    public function publicIndex()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $songLists = SongList::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();;
        foreach ($songLists as $list) {
            $list->user;
        }
        return $songLists;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (count($request->all())) {
            return 'yes';
        } else {
            $numPlaylist = SongList::where('user_id', Auth::id())->count();
            $newPlaylistName = 'My playlist #' . $numPlaylist + 1;
            $songList = SongList::create([
                'user_id' => Auth::id(),
                'image' => '0.jpg',
                'name' => $newPlaylistName,
                'duration' => 0,
                'private_setting' => true,
                'song_list_type_id' => 2,
            ]);
            $songList->user;
            return $songList;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(SongList $songList)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SongList $songList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $songList = SongList::find($id);
        $user = Auth::user();
        if ($user->can('update', $songList)) {
            $songList->name = $request->name;
            $songList->description = $request->description;
            if ($request->hasFile('image')) {

                Storage::delete('public/images/' . $songList->image);

                $fileName =   hash('sha256', $user->id . microtime(true)) . '.' . $request->file('image')->extension();
                $songList->image = $fileName;
                Storage::putFileAs('public/images/', $request->file('image'), $fileName);
            }

            $songList->save();
            $songList->user;
            return response()->json([
                'status' => true,
                'message' => 'Update Success',
                'data' => $songList,
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = Auth::user();
        $songList = SongList::find($request->id);
        if ($user->can('delete', $songList)) {
            $songList->delete();
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => true,
            'message' => 'Delete success ' . $songList->name,
        ], 200);
    }
}
