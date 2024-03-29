<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;

class Song extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = ['name', 'image', 'link', 'lyrics', 'duration', 'description', 'song_status_id', 'upload_by'];

    public $timestamps = true;

    protected $appends = ['is_followed'];

    public function artists()
    {
        return $this->belongsToMany(Artist::class, 'artist_have_songs');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'song_have_categories');
    }

    public function views()
    {
        $total = DB::table('user_song_actions')
            ->where('song_id', '=', $this->id)
            ->where('action_type_id', '=', 2)
            ->count();
        return $total;
    }

    // Define the attribute accessor for is_followed
    public function getIsFollowedAttribute()
    {
        $userId = Auth::id(); // Get the current user's ID
        if ($userId) {
            return $this->followers()->where('user_id', $userId)->exists();
        }
        return false;
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'user_song_actions')
                    ->where('action_type_id', 3);
    }
    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'lyrics' => $this->lyrics,
        ];
    }
}
