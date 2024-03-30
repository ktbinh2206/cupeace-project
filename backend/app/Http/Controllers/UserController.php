<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::all();
        return ($user);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $request;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function usersWithRoles(Request $request)
    {
        $order = $request->query('order');
        $field = $request->query('field');
        $perPage = (int)$request->query('per_page');

        $users = User::with('roles')->orderBy($field, $order)->paginate($perPage);

        return response()->json($users);
    }

    public function getAllRoles()
    {
        $roles = DB::table('roles')->get();
        return $roles;
    }

    public function profile(Request $request){

        $useId = $request->query('id');
        $user = User::find($useId);
        $user->followings;
        $user->playlists;
        return $user;
    }
}
