<?php

namespace App\Services;

use App\Models\ContainerTemplate;
use Illuminate\Support\Facades\Auth;

class ContainerTemplateService
{
    public function getAllTemplates()
    {
        $user = Auth::user();

        return ContainerTemplate::where('user_id', $user->id)->get();
    }

    public function createTemplate(array $data)
    {
        $user = Auth::user();

        return ContainerTemplate::create([
            'name' => $data['name'],
            'configuration' => json_encode($data['configuration']),
            'user_id' => $user->id,
        ]);
    }

    public function getTemplate($id)
    {
        return ContainerTemplate::findOrFail($id);
    }

    public function deleteTemplate($id)
    {
        $template = $this->getTemplate($id);
        $template->delete();
    }
}
