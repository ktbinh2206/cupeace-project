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
        $songs = Song::search($searchValue)->get();
        $artists = Artist::search($searchValue)->get();

        $searchData = (object) [
            'songs' => $songs,
            'artists' => $artists
        ];
        return $searchData;
    }
}
