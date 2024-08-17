<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows an admin to access the configs page', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->get(route('settings.general'))
        ->assertStatus(200);
});

it('denies non-admin access to the configs page', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('settings.general'))
        ->assertStatus(403);
});

it('allows an admin to update a config', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $config = Setting::create([
        'key' => 'store_name',
        'value' => 'Store',
        'description' => 'lorem ipsum dolor sit amet',
    ]);

    $this->actingAs($admin)
        ->patch(route('settings.update', $config->id), [
            'key' => 'store_name1',
            'value' => 'New Store Name',
        ])
        ->assertRedirect();

    expect($config->fresh()->value)->toBe('New Store Name')
        ->and($config->fresh()->key)->toBe('store_name1');
});
