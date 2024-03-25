<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;

class Song extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = ['name', 'image', 'link', 'lyrics', 'duration', 'description', 'song_status_id', 'upload_by'];

    public $timestamps = true;

    public function artists()
    {
        return $this->belongsToMany(Artist::class, 'artist_have_songs');
    }

    public function views()
    {
        $total = DB::table('user_song_actions')
            ->where('song_id', '=', $this->id)
            ->where('action_type_id', '=', 2)
            ->count();
        return $total;
    }

    public function isFollowed()
    {
        $song = DB::table('user_song_actions')
            ->where('song_id', '=', $this->id)
            ->where('action_type_id', '=', 3)
            ->exists();
        return $song;
    }

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'lyrics' => $this->lyrics,
        ];
    }
}
