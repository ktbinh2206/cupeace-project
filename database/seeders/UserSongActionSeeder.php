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

        $data = [
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'user_id' => $datum[0],
                'song_id' => $datum[1],
                'duration' => $datum[2],
                'created_at' => $datum[3],
                'updated_at' => $datum[4],
                'action_type_id' => $datum[5],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
