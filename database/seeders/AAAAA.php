<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AAAAA extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('.');

        $data = [
            ['.'],
            ['.'],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                '.' => $datum[0],
                '.' => $datum[1],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
