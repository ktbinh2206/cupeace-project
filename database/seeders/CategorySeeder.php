<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('categories');

        $data = [
            ['VietNam',1],
            ['Korea',1],
            ['RnB',2],
            ['Pop',2],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'name' => $datum[0],
                'category_type_id' => $datum[1],
            ]);
        }
        Schema::enableForeignKeyConstraints();

    }
}
