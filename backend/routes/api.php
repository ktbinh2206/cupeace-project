<?php

use App\Http\Controllers\ArtistController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SongController;
use App\Http\Controllers\SongListController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

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
})->name('get-image');
//
Route::get('/get-song/{path}', function ($path) {
    $file = Storage::path('\public\songs' . '\\' . $path);
    return response()->file($file);
})->name('get-song');

//logined route
Route::middleware('auth:sanctum')->group(function () {
    //
    Route::prefix('/users')->group(function () {
        // /users/roles/order=?&field=?
        Route::get('/roles', [UserController::class, 'usersWithRoles'])->name('users.roles');
        Route::resource('/', UserController::class);
    });
    //
    Route::prefix('/user')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'user'])->name('user.notifitions');
        Route::post('/notifications/read', [NotificationController::class, 'read'])->name('user.read.notification');
        Route::get('/artist', [ArtistController::class, 'userID'])->name('user.artist');
    });
    //
    Route::group(["prefix" => "/song"], function () {
        Route::post('/follow', [SongController::class, 'follow'])->name('song.follow');
        Route::post('/unfollow', [SongController::class, 'unfollow'])->name('song.unfollow');
        Route::get('/status', [SongController::class, 'getSongByStatusId'])->name('song.status');
        Route::post('/upload', [SongController::class, 'upload'])->name('song.upload');
        Route::post('/stream', [SongController::class, 'stream'])->name('song.stream');
        Route::get('/follow/{songID}', [SongController::class, 'isFollow'])->name('song.isfollow');
    });
    //
    Route::get('/user', function (Request $request) {
        $user = Auth::user();
        return $user;
    });
    //
    Route::get('/roles', [UserController::class, 'getAllRoles'])->name('roles.index');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    //
    Route::get('/library/songs', [SongController::class, 'getFollowSongs'])->name('songs.library');
    Route::get('/songs/statuses', [SongController::class, 'statuses'])->name('song.statuses'); //get number of songs each status
    Route::post('/songs/status', [SongController::class, 'updateStatus'])->name('');
    Route::get('/song/get-playlists', [SongController::class, 'getPlaylist'])->name(('song.playlists'));
    Route::post('/song/logs', [SongController::class, 'logStream'])->name(('song.log'));

    Route::get('/home/user', [SongController::class, 'homeForLoginedUser'])->name('home.user');

    Route::post('/song-lists', [SongListController::class, 'store'])->name('songLists.store');
    Route::get('/song-lists', [SongListController::class, 'index'])->name('songLists.index');
    Route::delete('/song-lists', [SongListController::class, 'destroy'])->name('songLists.destroy');
    Route::patch('/song-lists/{id}', [SongListController::class, 'update'])->name(('songLists.update'));
    Route::post('/song-lists/{playlistId}/song/{songId}', [SongListController::class, 'addSong'])->name('songLists.add_song');
    Route::delete('/song-lists/{playlistId}/song/{position}', [SongListController::class, 'removeSong'])->name('songLists.remove');
});
//
Route::get('/categories/search', [CategoryController::class, 'search'])->name('categories.search');
Route::resource('/categories', CategoryController::class);
//
Route::post('/signup', [AuthController::class, 'signup'])->name('signup');
Route::post('/login', [AuthController::class, 'login'])->name('login');
//
Route::resource('/songs', SongController::class);
Route::get('/home/guest', [SongController::class, 'homeForGuest'])->name('home.guest');
Route::get('/songs/{id}/artists', [SongController::class, 'artists'])->name('song.artists'); //Get artist of specific song (Not recommend use)
Route::get('/song/streams', [SongController::class, 'streams'])->name('song.streams');
//
Route::get('/search', [SearchController::class, 'search'])->name('search');
//
Route::resource('/artists', ArtistController::class);
Route::get('/artists/{id}/songs', [ArtistController::class, 'songs'])->name('artist.songs');
Route::get('/artists/search', [ArtistController::class, 'search'])->name('aritsts.search');
Route::get('/artist/profile', [ArtistController::class, 'profile'])->name('artist.profile');

Route::get('/user/profile', [UserController::class, 'profile'])->name('user.profile');

Route::patch('/test', [TestController::class, 'test']);
