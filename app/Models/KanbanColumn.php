<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KanbanColumn extends Model {
  protected $fillable = [
    'name',
    'order',
    'project_id',
    'is_default',
    'task_status_id',
    'color',
  ];

  protected $casts = [
    'is_default' => 'boolean',
    'order' => 'integer',
  ];

  // Add relationship to TaskStatus
  public function taskStatus(): BelongsTo {
    return $this->belongsTo(TaskStatus::class);
  }

  public function project(): BelongsTo {
    return $this->belongsTo(Project::class);
  }

  public function tasks(): HasMany {
    return $this->hasMany(Task::class, 'kanban_column_id');
  }
}
