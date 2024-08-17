<?php

namespace App\Http\Controllers;

use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /*
 * This calls does not have a policy because it uses a middleware for the routes web.php
 *
 * */
    protected SettingsService $configService;

    public function __construct(SettingsService $configService)
    {
        $this->configService = $configService;
    }

    public function index(Request $request): \Inertia\Response
    {
        $configs = $this->configService->getAllConfigs();

        return Inertia::render('GeneralSettings', ['settings' => $configs]);
    }

    public function update(Request $request, $id): \Illuminate\Http\RedirectResponse
    {

        $validated = $request->validate([
            'key' => 'required|string',
            'value' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $this->configService->updateConfig($id, $validated);

        return redirect()->back()->with('success', 'Config updated successfully');
    }
}
