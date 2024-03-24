<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            SongListTypeSeeder::class,
            ActionTypeSeeder::class,
            SubscriptionStatusSeeder::class,
            SubscriptionPlanSeeder::class,
            PaymentMethodSeeder::class,
            CategoryTypeSeeder::class,
            CategorySeeder::class,
            SongStatusSeeder::class,
            SongSeeder::class,
            ArtistSeeder::class,
            ArtistHasSongsSeeder::class,
            UserSongActionSeeder::class,
        ]);
    }
}
