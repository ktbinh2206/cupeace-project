<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Song;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $searchValue = $request->query('q');

        $songs_query = Song::query();
        $songs_query = Song::search($searchValue)->where('song_status_id', 1);
        $songs = $songs_query->get();
        foreach ($songs as $song) {
            $song->artists;
            $song->views = $song->views();
        }
        $songs = $songs->sortByDesc('views')->values();


        $artists_query = Artist::query();
        $artists_query = Artist::search($searchValue);
        $artists = $artists_query->get();
        foreach ($artists as $artist) {
            $artist->views = $artist->totalViews();
        }
        $artists = $artists->sortByDesc('views')->values();
        $data = (object)[
            'songs' => $songs,
            'artists' => $artists,
        ];

        return $data;
    }
}
