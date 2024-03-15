<?php

namespace Database\Seeders;

use App\Models\Song;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('songs');

        $data = [
            ['Chúng ta của hiện tại', '1.jpg', '', '', '1.mp3', 323, 2, 1],
            ['Lạ lùng', '2.jpg', '', '', '2.mp3', 323, 3, 1],
            ['Mascara', '3.jpg', '', '', '3.mp3', 323, 4, 1],
            ['Em của ngày hôm qua', '4.jpg', '', '', '4.mp3', 323, 2, 1],
            ['Fire', '5.jpg', '', '', '5.mp3', 323, 6, 1],
            ['We don\'t talk any more', '6.jpg', '', '', '6.mp3', 323, 7, 1],
            ['Playing with fire', '7.jpg', '', '', '7.mp3', 323, 8, 1],
            ['Blank Space', '8.jpg', '', '', '8.mp3', 323, 9, 1],
            ['Attention', '9.jpg', '', '', '9.mp3', 323, 7, 1],
            ['Cứ Chill Thôi', '10.jpg', '', '', '10.mp3', 323, 4, 1],
            ['Có em ở đây rồi', '11.jpg', '', '', '11.mp3', 323, 5, 1],
            ['Me!', '12.jpg', '', '', '12.mp3', 323, 9, 1],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $song = Song::create([
                'name' => $datum[0],
                'image' => $datum[1],
                'lyrics' => $datum[2],
                'description' => $datum[3],
                'link' => $datum[4],
                'duration' => $datum[5],
                'upload_by' => $datum[6],
                'song_status_id' => $datum[7],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
