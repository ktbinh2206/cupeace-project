<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CategoryTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('category_types');

        $data = [
            ['Region'],
            ['Genre'],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'name' => $datum[0],
            ]);
        }

        Schema::enableForeignKeyConstraints();

    }
}
