<?php

use App\Http\Controllers\ArtistController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SongController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerifyEmailController;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('/get-image/{path}', function ($path) {
    $file = Storage::path('\public\images' . '\\' . $path);
    return response()->file($file);
})->name('get_image');

Route::get('/get-song/{path}', function ($path) {
    $file = Storage::path('\public\songs' . '\\' . $path);
    return response()->file($file);
})->name('get-song');

//logined route
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('/users')->group(function () {
        // /users/roles/order=?&field=?
        Route::get('/roles', [UserController::class, 'usersWithRoles'])->name('users.roles');
        Route::resource('/', UserController::class);
    });

    Route::prefix('/user')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'user']);
        Route::post('/notifications/read', [NotificationController::class, 'read']);
        Route::get('/artist', [ArtistController::class, 'userID']);
    });

    Route::group(["prefix" => "/song"], function () {
        Route::post('/follow', [SongController::class, 'follow']);
        Route::post('/unfollow', [SongController::class, 'unfollow']);
        Route::get('/status', [SongController::class, 'getSongByStatusId']);
        Route::post('/upload', [SongController::class, 'upload']);
        Route::post('/stream', [SongController::class, 'stream']);
        Route::get('/follow/{songID}', [SongController::class, 'isFollow']);
    });

    Route::get('/user', function (Request $request) {
        $user = Auth::user();
        return $user;
    });

    Route::get('/roles', [UserController::class, 'getAllRoles']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/library/songs', [SongController::class, 'getFollowSongs']);
    Route::get('/songs/statuses', [SongController::class, 'statuses']);
    Route::post('/songs/status', [SongController::class, 'updateStatus']);
    Route::get('/home/user', [SongController::class, 'homeForLoginedUser']);
});

Route::get('/categories/search', [CategoryController::class,'search']);
Route::resource('/categories', CategoryController::class);

Route::post('/signup', [AuthController::class, 'signup'])->name('signup');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::resource('/songs', SongController::class);
Route::get('/home/guest', [SongController::class, 'homeForGuest']);
Route::get('/songs/{id}/artists', [SongController::class, 'artists']);
Route::get('/song/streams', [SongController::class, 'streams']);

Route::get('/search', [SearchController::class, 'search']);

Route::resource('/artists', ArtistController::class);
Route::get('/artists/{id}/songs', [ArtistController::class, 'songs']);
Route::get('/artists/search', [ArtistController::class, 'search'])->name('songs.artists');
Route::get('/artist/profile', [ArtistController::class, 'profile'])->name('artist.profile');
