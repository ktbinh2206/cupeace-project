<?php

namespace App\Services;

use App\Models\Song;
use Illuminate\Support\Facades\DB;

class RecommendationService
{

    public static function getByCategories(Song $song)
    {
        //Get categories of song
        $categories =  Song::find($song->id)->categories()->get();
        $song->artists;

        //Create empty array
        $id = [];
        //Loop for each categories
        foreach ($categories as $category) {
            //Get song Id for each category except current song
            $recommendedSongIds = DB::table('song_have_categories')
                ->where('category_id', $category->id)
                ->where('song_id', '<>', $song->id)
                ->get('song_id');
            //this not return an array

            foreach ($recommendedSongIds as $songId) {
                array_push($id, $songId->song_id);
            }
        }
        //id of song recommended
        $id = array_unique($id); //Remove duplicate id
        $recommendedSongs = Song::with('artists')->findMany($id)->toArray();

        shuffle($recommendedSongs);

        $recommendedSongs = array_merge(array($song), $recommendedSongs);

        return $recommendedSongs;
    }

    public static function generatePlaylist(Song $song)
    {
        // Implement your recommendation logic here
        // This is a simplified example, replace with your actual algorithm
        // Option 1: Find songs with the same genre
        $recommendedSongs = RecommendationService::getByCategories($song);

        //Add more song in  playlist if not enough 50
        try {
            if (count($recommendedSongs) <= 50) {
                // Fetch additional songs based on popularity
                $additionalRecs = Song::with('artists')->whereNotIn('id', array_column($recommendedSongs, 'id'))
                    ->take(50 - count($recommendedSongs))
                    ->get()
                    ->toArray();
            } else {
            }
        } catch (\Throwable $th) {
            $additionalRecs = Song::with('artists')->whereNotIn('id', array_column($recommendedSongs, 'id'))
                ->all()
                ->get()
                ->toArray();
        }

        shuffle($additionalRecs);
        // Merge additional recommendations with the existing ones
        $recommendedSongs = array_merge($recommendedSongs, $additionalRecs);

        return $recommendedSongs;
    }
}
