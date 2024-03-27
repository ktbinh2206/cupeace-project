<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Category extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = ['name'];

    public function songs(){
        return $this->belongsToMany(Song::class,'song_have_categories');
    }

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }
}
