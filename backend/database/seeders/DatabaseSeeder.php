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
            ActionTypeSeeder::class,
            ArtistHasSongsSeeder::class,
            ArtistSeeder::class,
            CategorySeeder::class,
            PaymentMethodSeeder::class,
            RoleSeeder::class,
            SongHasCategoriesSeeder::class,
            SongListTypeSeeder::class,
            SongSeeder::class,
            SongStatusSeeder::class,
            SubscriptionPlanSeeder::class,
            SubscriptionStatusSeeder::class,
            UserSeeder::class,
            UserSongActionSeeder::class,
        ]);
    }
}
