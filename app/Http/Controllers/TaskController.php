<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use App\Enum\RolesEnum;
use App\Models\Project;
use App\Models\TaskLabel;
use App\Services\TaskService;
use App\Traits\LoadsCommentsTrait;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\TaskLabelResource;
use App\Http\Resources\TaskCommentResource;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;

class TaskController extends Controller {
    use LoadsCommentsTrait;

    protected $taskService;

    public function __construct(TaskService $taskService) {
        $this->taskService = $taskService;
    }

    public function index() {
        $user = Auth::user();
        $filters = request()->all();
        $tasks = $this->taskService->getTasks($user, $filters);
        $options = $this->taskService->getOptions();

        return Inertia::render('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'labelOptions' => $options['labelOptions'],
            'projectOptions' => $options['projectOptions'],
            'statusOptions' => $options['statusOptions'],
            'permissions' => [
                'canManageTasks' => $tasks->first()?->project->canManageTask($user),
            ],
        ]);
    }

    public function create() {
        $user = Auth::user();
        $projectId = request('project_id');
        $statusId = request('status_id');
        $selectedProject = $projectId ? Project::findOrFail($projectId) : null;

        $projects = Project::query()
            ->whereHas('invitedUsers', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('status', 'accepted')
                    ->whereIn('role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value]);
            })
            ->orderBy('name', 'asc')
            ->get();

        $canAssignOthers = !$selectedProject || !$selectedProject->isProjectMember($user);

        $users = $selectedProject ? $this->getProjectUsers($selectedProject) : collect();

        $labelsQuery = TaskLabel::whereNull('project_id');
        if ($selectedProject) {
            $labelsQuery->orWhere('project_id', $selectedProject->id);
        }
        $labels = $labelsQuery->orderBy('name', 'asc')->get();

        $statuses = $this->taskService->getStatusOptions($selectedProject);

        return Inertia::render('Task/Create', [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'labels' => TaskLabelResource::collection($labels),
            'canAssignOthers' => $canAssignOthers,
            'currentUserId' => $user->id,
            'statusOptions' => $statuses,
            'selectedProjectId' => $selectedProject?->id,
            'selectedStatusId' => $statusId,
            'fromProjectPage' => (bool)$projectId,
        ]);
    }

    private function getProjectUsers(?Project $project): \Illuminate\Support\Collection {
        if (!$project) {
            return collect();
        }

        $user = Auth::user();

        if ($project->isProjectMember($user)) {
            return collect([$user]);
        }

        return $project->acceptedUsers()
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getUsers(Project $project) {
        $user = Auth::user();

        if (!$project->acceptedUsers()->where('user_id', $user->id)->exists()) {
            abort(403, 'Anda tidak memiliki otoritas untuk melihat anggota proyek.');
        }

        $users = $this->getProjectUsers($project);
        return response()->json([
            'users' => [
                'data' => UserResource::collection($users)
            ]
        ]);
    }

    public function store(StoreTaskRequest $request) {
        $data = $request->validated();
        $user = Auth::user();
        $project = Project::findOrFail($data['project_id']);

        if (!$project->acceptedUsers()
            ->where('user_id', $user->id)
            ->whereIn('role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value])
            ->exists()) {
            abort(403, 'Anda tidak dapat membuat tugas untuk proyek ini.');
        }

        if (
            $project->isProjectMember($user) &&
            ($data['assigned_user_id'] && $data['assigned_user_id'] != $user->id)
        ) {
            $data['assigned_user_id'] = $user->id;
        }

        $this->taskService->storeTask($data);
        return to_route('task.index')->with('success', 'Tugas berhasil dibuat.');
    }

    public function show(Task $task) {
        $task->load([
            'labels',
            ...$this->getCommentsLoadingOptions()
        ]);

        return Inertia::render('Task/Show', [
            'task' => new TaskResource($task),
            'comments' => TaskCommentResource::collection($task->comments),
            'success' => session('success'),
        ]);
    }

    public function edit(Task $task) {
        $user = Auth::user();
        $project = $task->project;

        if (!$project->canEditTask($user, $task)) {
            abort(403, 'Anda tidak memiliki otoritas untuk mengubah tugas ini.');
        }

        $canChangeAssignee = !$project->isProjectMember($user);

        $task->load('labels');
        $projects = Project::where('id', $project->id)->get();

        $users = $this->getProjectUsers($project);

        $projectId = $task->project_id;
        $labels = TaskLabel::whereNull('project_id')
            ->orWhere('project_id', $projectId)
            ->orderBy('name', 'asc')
            ->get();

        $statuses = $this->taskService->getStatusOptions($task->project);

        return Inertia::render('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'labels' => TaskLabelResource::collection($labels),
            'canChangeAssignee' => $canChangeAssignee,
            'statusOptions' => $statuses,
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task) {
        $user = Auth::user();
        $project = $task->project;

        if (!$project->canEditTask($user, $task)) {
            abort(403, 'Anda tidak memiliki otoritas untuk mengubah tugas ini.');
        }

        if (!$project->canManageTask($user)) {
            unset($request['assigned_user_id']);
        }

        $data = $request->validated();
        $this->taskService->updateTask($task, $data);

        return to_route('task.index')->with('success', "Tugas '{$task->name}' berhasil diperbarui.");
    }

    public function destroy(Task $task) {
        $user = Auth::user();
        $project = $task->project;

        if (!$project->canDeleteTask($user, $task)) {
            abort(403, 'Anda tidak memiliki otoritas untuk menghapus tugas ini.');
        }

        $this->taskService->deleteTask($task);

        return to_route('task.index')->with('success', "Tugas '{$task->name}' berhasil dihapus.");
    }

    public function myTasks() {
        $user = Auth::user();
        $tasks = $this->taskService->getMyTasks($user, request()->all());
        $options = $this->taskService->getOptions();

        return Inertia::render('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'labelOptions' => $options['labelOptions'],
            'projectOptions' => $options['projectOptions'],
            'statusOptions' => $options['statusOptions'],
            'permissions' => [
                'canManageTasks' => $tasks->first()?->project->canManageTask($user),
            ],
        ]);
    }

    public function assignToMe(Task $task) {
        $user = Auth::user();

        if (!$task->canBeAssignedBy($user)) {
            abort(403, 'Anda tidak dapat menugaskan tugas ini.');
        }

        $task->update([
            'assigned_user_id' => $user->id,
            'updated_by' => $user->id
        ]);

        return back()->with('success', 'Tugas berhasil ditugaskan ke Anda.');
    }

    public function unassign(Task $task) {
        $user = Auth::user();

        if (!$task->canBeUnassignedBy($user)) {
            abort(403, 'Anda tidak dapat melepas penugasan tugas ini.');
        }

        $task->update([
            'assigned_user_id' => null,
            'updated_by' => $user->id
        ]);

        return back()->with('success', 'Penugasan tugas berhasil dilepas.');
    }

    public function deleteImage(Task $task) {
        $user = Auth::user();

        if (!$task->project->canEditTask($user, $task)) {
            abort(403, 'Anda tidak memiliki otoritas untuk menghapus gambar tugas ini.');
        }

        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }

        $task->update(['image_path' => null]);

        return back()->with('success', 'Gambar tugas berhasil dihapus.');
    }

    public function getProjectStatuses(Project $project) {
        $statusOptions = $this->taskService->getStatusOptions($project);
        return response()->json(['statusOptions' => $statusOptions]);
    }

    public function getProjectLabels(Project $project) {
        $query = request('query');

        $labels = TaskLabel::query()
            ->where(function ($queryBuilder) use ($project) {
                $queryBuilder->whereNull('project_id')
                    ->orWhere('project_id', $project->id);
            })
            ->when($query, function ($queryBuilder) use ($query) {
                $queryBuilder->where('name', 'like', "%{$query}%");
            })
            ->orderBy('name')
            ->get();

        return TaskLabelResource::collection($labels);
    }
}