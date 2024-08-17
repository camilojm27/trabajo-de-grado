<?php

namespace App\Services;

use App\Models\Setting;

class SettingsService
{
    public function getAllConfigs($perPage = 10)
    {
        return Setting::orderBy('id')->paginate($perPage);
    }

    public function updateConfig($id, $data)
    {
        $config = Setting::findOrFail($id);
        $config->update($data);

        return $config;
    }
}
