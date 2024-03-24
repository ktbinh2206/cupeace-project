<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_song_actions', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('song_id')->constrained();
            $table->time('duration')->nullable();
            $table->timestamps();
            $table->foreignId('action_type_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_song_actions');
    }
};
