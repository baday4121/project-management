<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TaskLabel;
use App\Enum\RolesEnum;
use App\Services\TaskLabelService;
use App\Http\Resources\TaskLabelResource;
use App\Http\Requests\TaskLabel\StoreTaskLabelRequest;
use App\Http\Requests\TaskLabel\UpdateTaskLabelRequest;
use Illuminate\Support\Facades\Auth;

class TaskLabelController extends Controller {
    protected $taskLabelService;

    public function __construct(TaskLabelService $taskLabelService) {
        $this->taskLabelService = $taskLabelService;
    }

    private function authorizeManager(Project $project) {
        $userRole = $project->getUserProjectRole(Auth::user());
        if ($userRole !== RolesEnum::ProjectManager->value) {
            abort(403, 'Hanya Manajer Proyek yang memiliki akses ke fitur ini.');
        }
    }

    public function index(Project $project) {
        $this->authorizeManager($project);

        $filters = request()->all();
        $labels = $this->taskLabelService->getProjectLabels($project, $filters);

        return inertia('TaskLabels/Index', [
            'project' => $project->only('id', 'name'),
            'labels' => TaskLabelResource::collection($labels),
            'success' => session('success'),
            'queryParams' => $filters,
        ]);
    }

    public function create(Project $project) {
        $this->authorizeManager($project);
        
        return inertia('TaskLabels/Create', [
            'project' => $project->only('id', 'name'),
        ]);
    }

    public function store(StoreTaskLabelRequest $request, Project $project) {
        $this->authorizeManager($project);

        $data = $request->validated();
        $data['project_id'] = $project->id;

        $label = $this->taskLabelService->storeLabel($data);

        return to_route('project.labels.index', $project)
            ->with('success', "Label '{$label->name}' berhasil dibuat.");
    }

    public function edit(Project $project, TaskLabel $label) {
        $this->authorizeManager($project);

        if (is_null($label->project_id)) {
            abort(403, 'Label bawaan sistem tidak dapat diubah.');
        }

        return inertia('TaskLabels/Edit', [
            'project' => $project->only('id', 'name'),
            'label' => new TaskLabelResource($label),
        ]);
    }

    public function update(UpdateTaskLabelRequest $request, Project $project, TaskLabel $label) {
        $this->authorizeManager($project);

        if (is_null($label->project_id)) {
            abort(403, 'Label bawaan sistem tidak dapat diubah.');
        }

        $label = $this->taskLabelService->updateLabel($label, $request->validated());
        
        return to_route('project.labels.index', $project)
            ->with('success', "Label '{$label->name}' berhasil diperbarui.");
    }

    public function destroy(Project $project, TaskLabel $label) {
        $this->authorizeManager($project);

        if (is_null($label->project_id)) {
            abort(403, 'Label bawaan sistem tidak dapat dihapus.');
        }

        $name = $label->name;
        $this->taskLabelService->deleteLabel($label);
        
        return to_route('project.labels.index', $project)
            ->with('success', "Label '{$name}' berhasil dihapus.");
    }
}