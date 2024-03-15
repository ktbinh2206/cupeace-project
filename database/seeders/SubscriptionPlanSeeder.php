<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $table = DB::table('subscription_plans');

        $data = [
            ['Pro', 20000, 'You can do st', date('Y-m-d', strtotime('0000-06-00'))],
            ['Artist', 200000, 'You will be an artist account', date('Y-m-d', strtotime('0001-00-00'))],
        ];

        Schema::disableForeignKeyConstraints();
        $table->truncate();

        foreach ($data as $datum) {
            $table->insert([
                'name' => $datum[0],
                'price' => $datum[1],
                'description' => $datum[2],
                'duration' => $datum[3],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
