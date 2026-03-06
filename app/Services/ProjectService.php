<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Enum\RolesEnum;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Events\ProjectInvitationRequestReceived;
use App\Notifications\ProjectInvitationNotification;

class ProjectService extends BaseService {
  use FilterableTrait, SortableTrait;

  protected $taskService;

  public function __construct(TaskService $taskService) {
    $this->taskService = $taskService;
  }

  public function getProjectOptions($project) {
    return [
      'labelOptions' => $this->taskService->getLabelOptions($project),
      'statusOptions' => $this->taskService->getStatusOptions($project, false),
    ];
  }

  public function getProjects($user, array $filters) {
    $query = Project::visibleToUser($user->id)
      ->with(['tasks' => function ($query) {
        $query->latest()->limit(5)->with('labels');
      }])
      ->withCount([
        'tasks as total_tasks',
        'tasks as completed_tasks' => function ($query) {
          $query->where('status', 'completed');
        }
      ]);

    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status'], 'project'); 
    }
    if (isset($filters['created_at'])) {
      $this->applyDateRangeFilter($query, $filters['created_at'], 'created_at');
    }

    return $this->paginateAndSort($query, $filters, 'projects');
  }

  public function storeProject($data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();
    $data['due_date'] = $this->formatDate($data['due_date'] ?? null);

    if (isset($data['image'])) {
      $data['image_path'] = $this->handleImageUpload($data['image'], 'project');
    }

    return Project::create($data);
  }

  public function updateProject($project, $data) {
    $data['updated_by'] = Auth::id();

    if (isset($data['due_date'])) {
      $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
    } else {
      $data['due_date'] = null;
    }

    if (isset($data['image'])) {
      if ($project->image_path) {
        Storage::disk('public')->deleteDirectory(dirname($project->image_path));
      }
      $data['image_path'] = $data['image']->store('project/' . Str::random(10), 'public');
    }

    $project->update($data);

    return $project;
  }

  public function deleteProject($project) {
    if ($project->image_path) {
      Storage::disk('public')->deleteDirectory(dirname($project->image_path));
    }

    $project->delete();
  }

  public function getProjectWithTasks(Project $project, array $filters) {
    $query = $project->tasks()->with(['labels', 'project', 'assignedUser']);

    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name'], 'tasks.name');
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status'], 'task');
    }
    if (isset($filters['priority'])) {
      $this->applyPriorityFilter($query, $filters['priority']);
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }
    if (isset($filters['due_date'])) {
      $this->applyDateRangeFilter($query, $filters['due_date'], 'tasks.due_date');
    }

    return $this->paginateAndSort($query, $filters, 'tasks');
  }

  public function handleInvitation(Project $project, string $email) {
    $user = User::where('email', $email)->first();

    if (!$user) {
      return ['success' => false, 'message' => 'Pengguna tidak ditemukan.'];
    }

    $existingInvitation = $project->invitedUsers()
      ->where('user_id', $user->id)
      ->first();

    if ($existingInvitation && $existingInvitation->pivot->status === 'rejected') {
      $project->invitedUsers()->updateExistingPivot($user->id, [
        'status' => 'pending',
        'role' => RolesEnum::ProjectMember->value,
        'updated_at' => now(),
      ]);

      $user->notify(new ProjectInvitationNotification($project));

      broadcast(new ProjectInvitationRequestReceived($project, $user));
      return ['success' => true, 'message' => 'Undangan berhasil dikirim ulang.'];
    }

    if (!$existingInvitation) {
      $project->invitedUsers()->attach($user->id, [
        'status' => 'pending',
        'role' => RolesEnum::ProjectMember->value,
        'created_at' => now(),
        'updated_at' => now()
      ]);

      $user->notify(new ProjectInvitationNotification($project));

      broadcast(new ProjectInvitationRequestReceived($project, $user));

      return ['success' => true, 'message' => 'Undangan berhasil dikirim.'];
    }

    return ['success' => false, 'message' => 'Pengguna ini sudah diundang sebelumnya.'];
  }

  public function getPendingInvitations(User $user, array $filters = []) {
    $filters['sort_field'] = $filters['sort_field'] ?? 'created_at';
    $filters['sort_direction'] = $filters['sort_direction'] ?? 'desc';
    $filters['per_page'] = $filters['per_page'] ?? 10;

    $basicFilters = $this->getBasicFilters($filters);

    $query = $user->projectInvitations()
      ->wherePivot('status', 'pending')
      ->withPivot('created_at', 'updated_at', 'status');

    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }

    return $this->paginateAndSort($query, $filters, 'projects');
  }

  public function updateInvitationStatus(Project $project, User $user, string $status) {
    $project->invitedUsers()->updateExistingPivot($user->id, ['status' => $status]);
    return true;
  }

  public function leaveProject(Project $project, User $user) {
    if ($user->id === $project->created_by) {
      return ['success' => false, 'message' => 'Pemilik proyek tidak dapat keluar dari proyek mereka sendiri. Silakan hapus proyek sebagai gantinya.'];
    }

    $project->tasks()
      ->where('assigned_user_id', $user->id)
      ->update([
        'assigned_user_id' => null,
        'updated_by' => $user->id,
        'updated_at' => now()
      ]);

    $project->invitedUsers()->detach($user->id);

    return ['success' => true, 'message' => 'Anda telah keluar dari proyek.'];
  }

  public function kickMembers(Project $project, array $userIds) {
    $project->tasks()
      ->whereIn('assigned_user_id', $userIds)
      ->update([
        'assigned_user_id' => null,
        'updated_by' => Auth::id(),
        'updated_at' => now()
      ]);

    $project->invitedUsers()->detach($userIds);


    return ['success' => true, 'message' => 'Anggota yang dipilih telah dikeluarkan dari proyek.'];
  }

  public function updateUserRole(Project $project, int $userId, string $role) {
    $user = Auth::user();
    $targetUser = User::findOrFail($userId);

    $targetUserCurrentRole = $project->acceptedUsers()
      ->where('user_id', $targetUser->id)
      ->first()
      ->pivot
      ->role;

    if ($targetUser->id === $user->id) {
      return [
        'success' => false,
        'message' => 'Anda tidak dapat mengubah peran Anda sendiri.'
      ];
    }

    if ($targetUser->id === $project->created_by) {
      return [
        'success' => false,
        'message' => 'Tidak dapat mengubah peran pemilik proyek.'
      ];
    }

    $userRole = $project->acceptedUsers()
      ->where('user_id', $user->id)
      ->first()
      ->pivot
      ->role;

    $isCreator = $user->id === $project->created_by;
    $isProjectManager = $userRole === RolesEnum::ProjectManager->value;

    if (!$isCreator && !$isProjectManager) {
      return [
        'success' => false,
        'message' => 'Anda tidak memiliki izin untuk mengelola peran pengguna.'
      ];
    }

    if (
      $role === RolesEnum::ProjectMember->value &&
      $targetUserCurrentRole === RolesEnum::ProjectManager->value &&
      !$isCreator
    ) {
      return [
        'success' => false,
        'message' => 'Hanya pemilik proyek yang dapat menurunkan jabatan Manajer Proyek.'
      ];
    }

    $project->invitedUsers()->updateExistingPivot($userId, [
      'role' => $role,
      'updated_at' => now()
    ]);


    $actionType = $role === RolesEnum::ProjectManager->value ? 'diangkat menjadi' : 'diubah menjadi';
    $roleName = $role === RolesEnum::ProjectManager->value ? 'Manajer Proyek' : 'Anggota Proyek';

    return [
      'success' => true,
      'message' => "{$targetUser->name} telah {$actionType} {$roleName}."
    ];
  }
}