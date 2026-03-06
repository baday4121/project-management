<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{

    public function index()
    {
        return Inertia::render('Notes/Index', [
            'notes' => auth()->user()->notes()
                ->orderBy('is_pinned', 'desc')
                ->latest()
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'nullable|string|max:255',
            'content' => 'required|string',
            'color'   => 'nullable|string',
        ]);

        auth()->user()->notes()->create($validated);

        return back()->with('success', 'Catatan berhasil ditambahkan.');
    }

    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title'   => 'nullable|string|max:255',
            'content' => 'required|string',
            'color'   => 'nullable|string',
        ]);

        $note->update($validated);

        return back();
    }

    public function togglePin(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->update([
            'is_pinned' => !$note->is_pinned
        ]);

        return back();
    }

    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);
        
        $note->delete();

        return back()->with('success', 'Catatan berhasil dihapus.');
    }
}