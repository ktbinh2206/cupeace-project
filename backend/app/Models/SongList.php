<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SongList extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'user_id',
        'description',
        'created_at',
        'updated_at',
        'private_setting',
        'duration',
        'song_list_type_id',
    ];

    public $timestamp = true;

}
