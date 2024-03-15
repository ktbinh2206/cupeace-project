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
        Schema::create('song_lists', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->foreignId('user_id')->constrained();
            $table->string('description');
            $table->timestamps();
            $table->boolean('private_setting');
            $table->time('duration');
            $table->foreignId('song_list_type_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('song_lists');
    }
};
