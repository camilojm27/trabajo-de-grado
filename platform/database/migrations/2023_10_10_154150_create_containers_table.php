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
        Schema::create('containers', function (Blueprint $table) {
            $table->id();
            $table->string('container_id')->nullable()->unique();
            $table->uuid('node_id');
            $table->string('name')->unique();
            $table->string('image');
            $table->timestamp('created')->nullable();
            $table->string('state')->nullable();    // Docker container state
            $table->string('status')->nullable();   // success or error
            $table->json('error')->nullable();
            $table->boolean('verified');
            $table->json('attributes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('containers');
    }
};
