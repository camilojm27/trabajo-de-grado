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
            $table->uuid('node_id');
            $table->string('name')->unique();
            $table->string('image');
            $table->string('container_id')->nullable()->unique();
            $table->timestamp('created')->nullable();
            $table->string('status')->nullable();
            $table->string('ports')->nullable();
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
