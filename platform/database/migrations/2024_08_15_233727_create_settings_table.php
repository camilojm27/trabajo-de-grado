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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value');
            $table->string('description');
            $table->timestamps();
        });

        DB::table('settings')->insert([
            'key' => 'welcome_key',
            'value' => '1234',
            'description' => 'This value is the key to adding new nodes to the cluster.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'container_logs_size',
            'value' => '1000',
            'description' => 'The number of container lines you want to read',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'container_action_time',
            'value' => '-1',
            'description' => 'The time for an action to stay in the queue if the node is not available, -1 to ',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
