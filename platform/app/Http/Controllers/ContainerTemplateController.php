<?php
namespace App\Http\Controllers;

use App\Services\ContainerTemplateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContainerTemplateController extends Controller
{
    protected ContainerTemplateService $templateService;

    public function __construct(ContainerTemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    public function index(): \Inertia\Response
    {
        $templates = $this->templateService->getAllTemplates();
        return Inertia::render('ContainerTemplates/Index', ['templates' => $templates]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:container_templates',
            'configuration' => 'required|array',
        ]);

        $this->templateService->createTemplate($validated);
        return to_route('containers.create');
    }

    public function destroy($id): RedirectResponse
    {
        $this->templateService->deleteTemplate($id);
        return redirect()->back()->with('success', 'Template deleted successfully');
    }
}
