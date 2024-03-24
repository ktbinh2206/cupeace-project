<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('artists');

        $data = [
            ['Sơn Tùng','0.jpg',now(),'This is BTS',2],
            ['Vũ','1.jpg',now(),'This is Binh',3],
            ['Chillies','2.jpg',now(),'This is Chillies',4],
            ['Suni Hạ Linh','3.jpg',now(),'This is Suni',5],
            ['BTS','4.jpg',now(),'This is BTS',6],
            ['Charlie Puth','5.jpg',now(),'This is Puth',7],
            ['BlackPink','6.jpg',now(),'This is Blink',8],
            ['Taylor Swift','7.jpg',now(),'This is Swift',9],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'name' => $datum[0],
                'avatar' => $datum[1],
                'verified_at' => $datum[2],
                'description' => $datum[3],
                'user_id' => $datum[4],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
