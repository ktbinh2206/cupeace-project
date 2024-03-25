<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserSongActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('user_song_actions');



        Schema::disableForeignKeyConstraints();
        $table->truncate();
        for ($i = 0; $i < 100000; $i++) {
            $table->insert([
                'user_id' => rand(1, 19),
                'song_id' =>  rand(1, 12),
                'duration' =>  '00:00:30',
                'created_at' => now(),
                'updated_at' => now(),
                'action_type_id' => 2,
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
