<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;

class Artist extends Model
{
    use HasFactory;
    use Searchable;

    protected $table = 'artists';
    protected $fillable = ['name', 'avatar', 'description', 'user_id'];

    public $timestamps = true;

    public function songs()
    {
        return $this->belongsToMany(Song::class, 'artist_have_songs');
    }

    public function totalViews()
    {
        $total = 0;

        // Retrieve songs associated with the artist
        $songs = $this->songs()->get();

        foreach ($songs as $song) {
            // Retrieve the views for each song
            $views = DB::table('user_song_actions')
                ->where('song_id', $song->id)
                ->where('action_type_id', 2)
                ->count();

            // Add the views for the current song to the total
            $total += $views;
        }

        return $total;
    }

    public function followers()
    {
        $total = 0;

        $total = DB::table('user_song_actions')
            ->where('song_id', $this->id)
            ->where('action_type_id', 3)
            ->count();

        return $total;
    }

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
