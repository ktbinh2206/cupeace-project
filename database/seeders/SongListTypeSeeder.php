<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SongListTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('song_list_types')->truncate();

        $data = [
            ['album'],
            ['playlist'],
        ];
        foreach ($data as $datum) {
            DB::table('song_list_types')->insert(
                [
                    'name' => $datum[0],
                ]
            );
        }

        Schema::enableForeignKeyConstraints();
    }
}
