<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this::call(ConfigSeeder::class);
        // \App\Models\User::factory(10)->create();
        \App\Models\Node::factory(2)->create();
        \App\Models\Container::factory(10)->create();

         \App\Models\User::factory()->create([
             'name' => 'Test User',
             'email' => 'test@example.com',
             'password' => '$2y$10$Nm9dx7/kUdmfwhDtQOmR/..tWUmMoBArFL4wjU2KUJip4vxnlUNsm' //12345678
         ]);
    }
}