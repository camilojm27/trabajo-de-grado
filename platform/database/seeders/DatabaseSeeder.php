<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '$2y$10$Nm9dx7/kUdmfwhDtQOmR/..tWUmMoBArFL4wjU2KUJip4vxnlUNsm', //12345678
            'email_verified_at' => now(),
            'is_admin' => true,
        ]);

        $this::call(SettingSeeder::class);
        //        \App\Models\User::factory(10)->create();
        //        \App\Models\Node::factory(3)->create();
        //        \App\Models\Container::factory(10)->create();
    }
}
