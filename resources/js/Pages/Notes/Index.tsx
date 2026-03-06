import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Plus, Trash2, Pin, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

export default function NotesIndex({ notes }: any) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any>(null);

    // Form untuk Tambah Catatan
    const createForm = useForm({
        title: '',
        content: '',
        color: '#1f2937'
    });

    // Form untuk Edit Catatan
    const editForm = useForm({
        title: '',
        content: '',
        color: ''
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.data.content.trim()) return;
        createForm.post(route('notes.store'), {
            onSuccess: () => createForm.reset(),
            preserveScroll: true
        });
    };

    const openEditModal = (note: any) => {
        setSelectedNote(note);
        editForm.setData({
            title: note.title || '',
            content: note.content,
            color: note.color
        });
        setIsEditOpen(true);
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('notes.update', selectedNote.id), {
            onSuccess: () => setIsEditOpen(false),
            preserveScroll: true
        });
    };

    const togglePin = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Mencegah modal terbuka saat klik pin
        router.patch(route('notes.pin', id), {}, { preserveScroll: true });
    };

    const deleteNote = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Mencegah modal terbuka saat klik hapus
        if (confirm('Hapus catatan ini?')) {
            router.delete(route('notes.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold">Catatan Saya</h2>}>
            <Head title="Notes" />

            <div className="py-12 px-4 max-w-6xl mx-auto">
                {/* Form Tambah Catatan */}
                <form
                    onSubmit={submitCreate}
                    className="mb-12 max-w-xl mx-auto space-y-2 bg-card p-4 rounded-xl border border-primary/10 shadow-lg"
                >
                    <input
                        placeholder="Judul"
                        className="w-full bg-transparent border-none focus:ring-0 font-bold placeholder:text-muted-foreground/50"
                        value={createForm.data.title}
                        onChange={e => createForm.setData('title', e.target.value)}
                    />
                    <textarea
                        placeholder="Buat catatan..."
                        className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[100px] placeholder:text-muted-foreground/50"
                        value={createForm.data.content}
                        onChange={e => createForm.setData('content', e.target.value)}
                    />
                    <div className="flex justify-end pt-2">
                        <Button size="sm" type="submit" disabled={createForm.processing || !createForm.data.content}>
                            <Plus className="w-4 h-4 mr-1" /> Tambah
                        </Button>
                    </div>
                </form>

                {/* Grid Catatan */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {notes.map((note: any) => (
                        <Card
                            key={note.id}
                            onClick={() => openEditModal(note)}
                            className="break-inside-avoid p-5 group cursor-pointer transition-all hover:ring-2 hover:ring-primary/30 border-primary/5 shadow-sm"
                            style={{ backgroundColor: note.color }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-foreground tracking-tight">{note.title || 'Tanpa Judul'}</h3>
                                <button onClick={(e) => togglePin(e, note.id)} type="button" className="z-10">
                                    <Pin className={cn(
                                        "w-4 h-4 transition-all",
                                        note.is_pinned ? "text-primary fill-primary rotate-45" : "text-muted-foreground opacity-20 group-hover:opacity-100"
                                    )} />
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-[10]">
                                {note.content}
                            </p>

                            <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10"
                                    onClick={(e) => { e.stopPropagation(); openEditModal(note); }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                    onClick={(e) => deleteNote(e, note.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {notes.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground italic">Belum ada catatan. Mulai tulis ide hebatmu!</p>
                    </div>
                )}
            </div>

            {/* Modal Edit Catatan */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[525px]" style={{ backgroundColor: editForm.data.color }}>
                    <form onSubmit={submitUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Catatan</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs uppercase font-bold opacity-70">Judul</Label>
                                <Input
                                    id="title"
                                    value={editForm.data.title}
                                    onChange={e => editForm.setData('title', e.target.value)}
                                    className="bg-transparent border-primary/20 focus-visible:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-xs uppercase font-bold opacity-70">Isi Catatan</Label>
                                <Textarea
                                    id="content"
                                    rows={8}
                                    value={editForm.data.content}
                                    onChange={e => editForm.setData('content', e.target.value)}
                                    className="bg-transparent border-primary/20 focus-visible:ring-primary resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}