<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SongHasCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('song_have_categories');

        $data = [
            // Chúng ta của hiện tại
            [1, 5], // Jazz
            [1, 10], // Folk
            [1, 32], // Latin
            [1, 39], // Indie
            [1, 70], // Swing Revival

            // Lạ lùng
            [2, 12], // Alternative
            [2, 27], // Rocksteady
            [2, 36], // Grunge
            [2, 6], // Electronic
            [2, 17], // Disco

            // Mascara
            [3, 40], // Hard Rock
            [3, 42], // Heavy Metal
            [3, 5], // Jazz Fusion
            [3, 44], // Synth-pop
            [3, 84], // Post-rock

            // Em của ngày hôm qua
            [4, 7], // Blues
            [4, 47], // Dream Pop
            [4, 21], // Ska
            [4, 1], // Ambient
            [4, 56], // New Wave

            // Fire
            [5, 56], // Noise Rock
            [5, 78], // Yacht Rock
            [5, 64], // Reggae Fusion
            [5, 47], // Industrial
            [5, 2], // Acid Jazz

            // We don't talk any more
            [6, 18], // Dance
            [6, 32], // Latin
            [6, 10], // Dubstep
            [6, 15], // Electro House
            [6, 87], // Swing

            // Playing with fire
            [7, 39], // Indie
            [7, 55], // Nu Metal
            [7, 49], // Glam Rock
            [7, 4], // Afrobeat
            [7, 64], // Psychedelic

            // Blank Space
            [8, 2], // Rock
            [8, 14], // Country
            [8, 30], // Pop
            [8, 3], // Hip hop
            [8, 57], // Ambient House

            // Attention
            [9, 6], // Electronic
            [9, 70], // Swing Revival
            [9, 10], // Dub
            [9, 48], // Techno
            [9, 22], // Reggaeton

            // Cứ Chill Thôi
            [10, 51], // Folk Rock
            [10, 64], // Reggae Fusion
            [10, 20], // Emo
            [10, 1], // Ambient
            [10, 7], // Bossa Nova

            // Có em ở đây rồi
            [11, 36], // Grunge
            [11, 39], // Indie
            [11, 55], // Post-punk
            [11, 47], // Dream Pop
            [11, 6], // Electronic

            // Me!
            [12, 54], // Nu-disco
            [12, 58], // Post-rock
            [12, 64], // Psychedelic
            [12, 44], // Synth-pop
            [12, 5], // Jazz Fusion
        ];


        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'song_id' => $datum[0],
                'category_id' => $datum[1],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
