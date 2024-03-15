<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ArtistHasSongsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('artist_have_songs');

        $data = [
            [1,1],
            [2,2],
            [3,3],
            [1,4],
            [5,5],
            [6,6],
            [7,7],
            [8,8],
            [6,9],
            [3,10],
            [4,10],
            [4,11],
            [8,12],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'artist_id' => $datum[0],
                'song_id' => $datum[1],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
