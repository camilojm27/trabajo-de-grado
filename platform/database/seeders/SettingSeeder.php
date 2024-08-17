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
    }
}
