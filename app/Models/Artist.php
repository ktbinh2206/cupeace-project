<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Artist extends Model
{
    use HasFactory, Searchable;

    protected $table = 'artists';
    protected $fillable = ['name', 'avatar', 'description','user_id'];

    public $timestamps = true;

    public function songs()
    {
        return $this->belongsToMany(Song::class, 'artist_have_songs');
    }

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'description'=>$this->description,
        ];
    }
}
