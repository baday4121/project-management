<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\KanbanColumn;
use App\Enum\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\TaskStatus;

class KanbanController extends Controller 
{
    public function show(Project $project) 
    {
        $user = Auth::user();
        $userRole = $project->getUserProjectRole($user);

        // Ambil semua status yang tersedia (default + spesifik proyek)
        $statuses = TaskStatus::where('is_default', true)
            ->whereNull('project_id')
            ->orWhere('project_id', $project->id)
            ->orderBy('name')
            ->get();

        // Buat atau ambil kolom untuk setiap status
        $statuses->each(function ($status) use ($project) {
            $project->kanbanColumns()->firstOrCreate(
                ['task_status_id' => $status->id],
                [
                    'name' => $status->name,
                    'color' => $status->color,
                    'order' => $project->kanbanColumns()->max('order') + 1,
                    'is_default' => $status->is_default,
                ]
            );
        });

        // Ambil kolom beserta tugas-tugasnya
        $columns = $project->kanbanColumns()
            ->orderBy('order')
            ->with(['tasks.labels', 'tasks.assignedUser', 'tasks.project', 'tasks.createdBy', 'tasks.updatedBy', 'taskStatus'])
            ->get();

        return Inertia::render('Project/Kanban', [
            'project' => new ProjectResource($project),
            'columns' => $columns->map(function ($column) {
                return [
                    'id' => $column->id,
                    'name' => $column->name,
                    'order' => $column->order,
                    'color' => $column->color,
                    'is_default' => $column->is_default,
                    'taskStatus' => $column->taskStatus,
                    'tasks' => TaskResource::collection($column->tasks)->resource,
                ];
            }),
            'permissions' => [
                'canManageTasks' => in_array($userRole, [
                    RolesEnum::ProjectManager->value,
                    RolesEnum::ProjectMember->value
                ]),
                'canManageBoard' => $userRole === RolesEnum::ProjectManager->value,
            ],
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function moveTask(Request $request, Task $task) 
    {
        $user = Auth::user();
        $project = $task->project;
        $userRole = $project->getUserProjectRole($user);

        // Anggota proyek hanya bisa memindahkan tugas mereka sendiri
        if ($userRole === RolesEnum::ProjectMember->value && $task->assigned_user_id !== $user->id) {
            abort(403, 'Anda hanya diperbolehkan memindahkan tugas yang ditugaskan kepada Anda.');
        }

        // Project Manager bisa memindahkan tugas apa saja
        if (!in_array($userRole, [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value])) {
            abort(403, 'Anda tidak memiliki otoritas untuk memindahkan tugas.');
        }

        $request->validate([
            'column_id' => 'required|exists:kanban_columns,id',
        ]);

        $newColumn = KanbanColumn::where('id', $request->column_id)
            ->where('project_id', $project->id)
            ->firstOrFail();

        // Perbarui status jika berbeda dengan status saat ini
        if ($newColumn->task_status_id && $task->status_id !== $newColumn->task_status_id) {
            $task->status_id = $newColumn->task_status_id;
            $task->save();

            // Catat riwayat status
            if (!$task->statusHistory()->where('task_status_id', $newColumn->task_status_id)->exists()) {
                $task->statusHistory()->attach($newColumn->task_status_id);
            }
        }

        $task->kanban_column_id = $newColumn->id;
        $task->save();

        try {
            return back()->with('success', 'Tugas berhasil dipindahkan.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memindahkan tugas. Silakan coba lagi.');
        }
    }

    public function updateColumnsOrder(Request $request, Project $project) 
    {
        $user = Auth::user();
        $userRole = $project->getUserProjectRole($user);

        if ($userRole !== RolesEnum::ProjectManager->value) {
            abort(403, 'Hanya Manajer Proyek yang dapat mengatur ulang urutan kolom.');
        }

        $request->validate([
            'columns' => 'required|array',
            'columns.*.id' => 'required|exists:kanban_columns,id',
            'columns.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->columns as $column) {
            $project->kanbanColumns()
                ->where('id', $column['id'])
                ->update(['order' => $column['order']]);
        }

        try {
            return back()->with('success', 'Urutan kolom berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui urutan kolom.');
        }
    }
}