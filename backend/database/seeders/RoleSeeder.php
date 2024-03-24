<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = DB::table('roles');

        $data = [
            ['Admin','web'],
            ['Artist','web'],
            ['Normal User','web'],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'name' => $datum[0],
                'guard_name' => $datum[1],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
