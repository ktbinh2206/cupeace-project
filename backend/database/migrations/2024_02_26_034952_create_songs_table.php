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
        Schema::create('songs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->text('lyrics')->nullable();
            $table->string('description')->nullable();
            $table->string('link');
            $table->time('duration')->nullable();
            $table->foreignId('upload_by')->constrained('users', 'id');
            $table->foreignId('song_status_id')->constrained('song_statuses', 'id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('songs');
    }
};
