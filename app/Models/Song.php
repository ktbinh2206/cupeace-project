<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $fillable= ['name','image','link','lyrics','duration','description','song_status_id','upload_by' ];

    public $timestamps = true;

    public function artists(){
        return $this -> belongsToMany(Artist::class,'artist_have_songs');
    }

}
