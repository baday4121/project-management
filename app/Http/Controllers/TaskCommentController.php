<?php

namespace App\Http\Controllers;

use HTMLPurifier;
use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use App\Traits\LoadsCommentsTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskCommentController extends Controller {
  use AuthorizesRequests, LoadsCommentsTrait;

  public function store(Request $request, Task $task) {
    if (!$request->user()->can('comment_on_tasks')) {
      abort(403, 'Anda tidak memiliki izin untuk memberikan komentar pada tugas.');
    }

    $validated = $request->validate([
      'content' => 'required|string',
      'parent_id' => 'nullable|exists:task_comments,id'
    ]);

    $purifier = new HTMLPurifier();
    $sanitizedContent = $purifier->purify($validated['content']);

    $comment = $task->comments()->create([
      'content' => $sanitizedContent,
      'user_id' => Auth::id(),
      'parent_id' => $validated['parent_id'] ?? null,
    ]);

    $task->load($this->getCommentsLoadingOptions());

    return redirect()->route('task.show', $task->id);
  }

  public function update(Request $request, Task $task, TaskComment $comment) {
    $this->authorize('update', $comment);

    $validated = $request->validate([
      'content' => 'required|string'
    ]);

    $purifier = new HTMLPurifier();
    $sanitizedContent = $purifier->purify($validated['content']);

    $comment->update([
      'content' => $sanitizedContent,
      'is_edited' => true
    ]);

    $task->load($this->getCommentsLoadingOptions());

    return redirect()->route('task.show', $task->id);
  }

  public function destroy(Task $task, TaskComment $comment) {
    $this->authorize('delete', $comment);

    $comment->delete();

    $task->load($this->getCommentsLoadingOptions());

    return back()->with('success', 'Komentar berhasil dihapus.');
  }
}