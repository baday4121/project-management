<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectInvitationResource;
use App\Enum\RolesEnum;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller {
    protected $projectService;

    public function __construct(ProjectService $projectService) {
        $this->projectService = $projectService;
    }

    public function index() {
        $user = Auth::user();
        $filters = request()->all();

        $requestedTab = request()->query('tab');

        $projects = $this->projectService->getProjects($user, $filters);

        return Inertia::render('Project/Index', [
            'projects' => ProjectResource::collection($projects)->additional([
                'permissions' => $projects->map(function ($project) use ($user) {
                    return [
                        'id' => $project->id,
                        'canEditProject' => $project->canEditProject($user),
                    ];
                })->pluck('canEditProject', 'id'),
            ]),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'activeTab' => $requestedTab ?: 'overview',
        ]);
    }

    public function create() {
        return Inertia::render('Project/Create');
    }

    public function store(StoreProjectRequest $request) {
        $data = $request->validated();
        $project = $this->projectService->storeProject($data);

        $user = Auth::user();

        $project->invitedUsers()->attach($user->id, [
            'status' => 'accepted',
            'role' => RolesEnum::ProjectManager->value,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        if (!$user->hasRole(RolesEnum::ProjectManager->value)) {
            $user->assignRole(RolesEnum::ProjectManager->value);
        }

        return to_route('project.index')->with('success', "Proyek '{$project->name}' berhasil dibuat.");
    }

    public function show(Project $project) {
        $user = Auth::user();
        if (!$project->acceptedUsers()->where('user_id', $user->id)->whereIn('role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value])->exists()) {
            abort(403, 'Anda tidak memiliki otoritas untuk melihat proyek ini.');
        }

        $requestedTab = request()->query('tab');

        if ($requestedTab) {
            if ($requestedTab === 'invite' && $project->isProjectMember($user)) {
                abort(403, 'Anggota proyek tidak dapat mengakses bagian undangan.');
            }
        }

        $filters = request()->all();
        $filters['sort_field'] = request('sort_field', 'created_at');
        $filters['sort_direction'] = request('sort_direction'); 
        $filters['per_page'] = (int) request('per_page', 10);
        $filters['page'] = (int) request('page', 1);

        $tasks = $this->projectService->getProjectWithTasks($project, $filters);
        $options = $this->projectService->getProjectOptions($project);

        return Inertia::render('Project/Show', [
            'project' => new ProjectResource($project->load(['acceptedUsers'])),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
            'activeTab' => $requestedTab ?: 'tasks',
            'labelOptions' => $options['labelOptions'],
            'statusOptions' => $options['statusOptions'],
            'permissions' => [
                'canInviteUsers' => $project->canInviteUsers($user),
                'canEditProject' => $project->canEditProject($user),
                'canManageTasks' => $project->canManageTask($user),
                'canManageBoard' => $project->canManageBoard($user),
            ],
        ]);
    }

    public function assets(Project $project) {
        $user = Auth::user();
        
        if (!$project->isProjectMember($user) && !$project->canEditProject($user)) {
            abort(403, 'Anda tidak memiliki akses ke galeri aset proyek ini.');
        }

        $assets = $project->tasks()
            ->whereNotNull('image_path')
            ->select('id', 'name as task_name', 'image_path', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Project/Assets', [
            'project' => $project->only('id', 'name'),
            'assets' => $assets->map(function($asset) {
                return [
                    'task_id' => $asset->id,
                    'task_name' => $asset->task_name,
                    'url' => $asset->image_path,
                    'type' => pathinfo($asset->image_path, PATHINFO_EXTENSION) ?: 'image',
                    'date' => $asset->updated_at->diffForHumans(),
                ];
            }),
            'permissions' => [
                'canEditProject' => $project->canEditProject($user),
            ]
        ]);
    }

    public function edit(Project $project) {
        $user = Auth::user();
        if (!$project->canManage($user)) {
            abort(403, 'Anda tidak memiliki otoritas untuk mengedit proyek ini.');
        }

        return Inertia::render('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project) {
        $user = Auth::user();
        if (!$project->canManage($user)) {
            abort(403, 'Anda tidak memiliki otoritas untuk memperbarui proyek ini.');
        }

        $data = $request->validated();
        $this->projectService->updateProject($project, $data);

        return to_route('project.index')->with('success', "Proyek '{$project->name}' berhasil diperbarui.");
    }

    public function destroy(Project $project) {
        $user = Auth::user();
        if (!$project->canManage($user)) {
            abort(403, 'Anda tidak memiliki otoritas untuk menghapus proyek ini.');
        }

        $this->projectService->deleteProject($project);

        return to_route('project.index')->with('success', "Proyek '{$project->name}' berhasil dihapus.");
    }

    public function inviteUser(Request $request, Project $project) {
        $request->validate(['email' => 'required|email']);

        $result = $this->projectService->handleInvitation($project, $request->email);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    public function showInvitations(Request $request) {
        $invitations = $this->projectService->getPendingInvitations(Auth::user(), $request->all());

        return Inertia::render('Project/Invite', [
            'invitations' => ProjectInvitationResource::collection($invitations),
            'success' => session('success'),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    public function acceptInvitation(Project $project) {
        $this->projectService->updateInvitationStatus($project, Auth::user(), 'accepted');
        return redirect()->back()->with('success', 'Undangan telah diterima.');
    }

    public function rejectInvitation(Project $project) {
        $this->projectService->updateInvitationStatus($project, Auth::user(), 'rejected');
        return redirect()->back()->with('success', 'Undangan telah ditolak.');
    }

    public function leaveProject(Project $project) {
        $result = $this->projectService->leaveProject($project, Auth::user());

        if ($result['success']) {
            return to_route('dashboard')->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    public function checkRole(Project $project) {
        $user = Auth::user();
        return response()->json([
            'isProjectMember' => $project->isProjectMember($user),
        ]);
    }

    public function kickMembers(Request $request, Project $project) {
        $user = Auth::user();

        if (!$project->canKickProjectMember($user)) {
            abort(403, 'Anda tidak memiliki otoritas untuk mengeluarkan anggota dari proyek ini.');
        }

        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $userIds = $request->user_ids;

        $projectManagers = $project->acceptedUsers()
            ->whereIn('user_id', $userIds)
            ->where('role', RolesEnum::ProjectManager->value)
            ->exists();

        if ($projectManagers && !$project->canKickProjectManager($user)) {
            abort(403, 'Anda tidak memiliki otoritas untuk mengeluarkan Manajer Proyek.');
        }

        $result = $this->projectService->kickMembers($project, $userIds);

        return back()->with('success', $result['message']);
    }

    public function updateUserRole(Request $request, Project $project) {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:' . implode(',', [
                RolesEnum::ProjectManager->value,
                RolesEnum::ProjectMember->value,
            ]),
        ]);

        $result = $this->projectService->updateUserRole(
            $project,
            $request->user_id,
            $request->role
        );

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    public function deleteImage(Project $project) {
        if (!$project->canEditProject(Auth::user())) {
            abort(403, 'Anda tidak memiliki otoritas untuk menghapus gambar proyek ini.');
        }

        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        $project->update(['image_path' => null]);

        return back()->with('success', 'Gambar proyek berhasil dihapus.');
    }

    public function checkInvitation(Request $request, Project $project) {
        $email = $request->query('email');

        $hasPendingInvitation = $project->invitedUsers()
            ->where('email', 'LIKE', $email . '%') 
            ->wherePivot('status', 'pending')
            ->exists();

        return response()->json([
            'hasPendingInvitation' => $hasPendingInvitation
        ]);
    }
}