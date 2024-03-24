<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\CreateAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert users
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@admin',
            ],
            [
                'name' => 'Sơn Tùng',
                'email' => 'sontung@sontung',
            ],
            [
                'name' => 'Vũ',
                'email' => 'vu@vu',
            ],
            [
                'name' => 'Chillies',
                'email' => 'chillies@chillies',
            ],
            [
                'name' => 'Suni Hạ Linh',
                'email' => 'sunihalinh@sunihalinh',
            ],
            [
                'name' => 'BTS',
                'email' => 'bts@bts',
            ],
            [
                'name' => 'Charlie Puth',
                'email' => 'charlieputh@charlieputh',
            ],
            [
                'name' => 'Black Pink',
                'email' => 'blackpink@blackpink',
            ],
            [
                'name' => 'Taylor Swift',
                'email' => 'taylorswift@taylorswift',
            ],
        ];

        Schema::disableForeignKeyConstraints();
        User::truncate();
        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'avatar' => '0.jpg',
                'email_verified_at' => now(),
                'password' => bcrypt('123'), // password
                'remember_token' => Str::random(10),
            ]);

            // Assign roles based on user name
            if ($user->name === 'Admin') {
                $user->assignRole('Admin');
            } else {
                $user->assignRole('Artist');
            }
            $user->notify(new CreateAccount($user, $user->avatar));
        }



        User::factory(10)
            ->create()
            ->each(function ($user) {
                $user->assignRole('Normal User');
                $user->notify(new CreateAccount($user, $user->avatar));
            });;
        Schema::enableForeignKeyConstraints();
    }
}
