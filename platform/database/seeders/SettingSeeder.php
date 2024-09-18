<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        //TODO: IPBan
    }
}
