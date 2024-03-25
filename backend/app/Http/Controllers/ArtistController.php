<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class ArtistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $artists = Artist::all();
        return response()->json($artists);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $artist = Artist::find($id);
        if ($artist) {
            return response()->json($artist);
        }
        return response()->json([
            'message' => 'Not found artist'
        ]);
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

    public function songs($id)
    {
        $artist = Artist::findOrFail($id);
        $songs = $artist->songs;
        return response()->json($songs);
    }

    public function search(Request $request)
    {
        $query = Artist::query();
        $keyword = $request->query('q');
        if ($keyword) {
            $query = Artist::search($keyword)->orderBy('id', 'asc');
        }
        $artists = $query->get();
        if (count($artists) !== 0) {
            return response()->json($artists);
        }
        return response()->json(['Not found']);
    }

    public function userID()
    {
        $userId = Auth::id();
        $artist = Artist::where('user_id', $userId)->first();
        return response()->json($artist);
    }
    public function profile(Request $request)
    {
        $userId = Auth::id();

        $artistId = $request->query('id');
        $artist = Artist::find($artistId);



        $artist->songs = $artist->songs()->where('song_status_id', 1)->get();
        $artist->views = $artist->totalViews();
        $artist->followers = $artist->followers();

        foreach ($artist->songs as $song) {
            $song->views = $song->views();
        }
        return $artist;
    }
}
