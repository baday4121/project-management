import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Plus, Trash2, Pin, Pencil, Check } from "lucide-react";
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

// Daftar warna standar Google Keep
const COLORS = [
    { name: 'Default', value: '#1f2937' },
    { name: 'Red', value: '#7f1d1d' },
    { name: 'Blue', value: '#1e3a8a' },
    { name: 'Green', value: '#064e3b' },
    { name: 'Yellow', value: '#713f12' },
    { name: 'Purple', value: '#4c1d95' },
];

export default function NotesIndex({ notes }: any) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any>(null);

    const createForm = useForm({
        title: '',
        content: '',
        color: '#1f2937'
    });

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
        // Pastikan color ikut dikirim saat update
        editForm.put(route('notes.update', selectedNote.id), {
            onSuccess: () => setIsEditOpen(false),
            preserveScroll: true
        });
    };

    const togglePin = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        router.patch(route('notes.pin', id), {}, { preserveScroll: true });
    };

    const deleteNote = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('Hapus catatan ini?')) {
            router.delete(route('notes.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold">Catatan Saya</h2>}>
            <Head title="Notes" />

            <div className="py-12 px-4 max-w-6xl mx-auto">
                {/* Form Tambah Catatan dengan Color Picker */}
                <form
                    onSubmit={submitCreate}
                    className="mb-12 max-w-xl mx-auto space-y-2 bg-card p-4 rounded-xl border border-primary/10 shadow-lg"
                    style={{ backgroundColor: createForm.data.color }}
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
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex gap-1.5">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => createForm.setData('color', c.value)}
                                    className={cn(
                                        "h-6 w-6 rounded-full border border-white/20 transition-transform hover:scale-110 flex items-center justify-center",
                                        createForm.data.color === c.value && "ring-2 ring-white"
                                    )}
                                    style={{ backgroundColor: c.value }}
                                >
                                    {createForm.data.color === c.value && <Check className="h-3 w-3 text-white" />}
                                </button>
                            ))}
                        </div>
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
                                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-white/10"
                                    onClick={(e) => { e.stopPropagation(); openEditModal(note); }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-400 hover:bg-red-400/20"
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

            {/* Modal Edit Catatan dengan Color Picker */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[525px] border-none shadow-2xl" style={{ backgroundColor: editForm.data.color }}>
                    <form onSubmit={submitUpdate}>
                        <DialogHeader>
                            <DialogTitle className="text-white">Edit Catatan</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs uppercase font-bold text-white/70">Judul</Label>
                                <Input
                                    id="title"
                                    value={editForm.data.title}
                                    onChange={e => editForm.setData('title', e.target.value)}
                                    className="bg-white/5 border-white/10 focus-visible:ring-white text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-xs uppercase font-bold text-white/70">Isi Catatan</Label>
                                <Textarea
                                    id="content"
                                    rows={8}
                                    value={editForm.data.content}
                                    onChange={e => editForm.setData('content', e.target.value)}
                                    className="bg-white/5 border-white/10 focus-visible:ring-white text-white resize-none"
                                />
                            </div>
                            
                            {/* Color Picker di Modal Edit */}
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-white/70">Pilih Warna</Label>
                                <div className="flex gap-2">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => editForm.setData('color', c.value)}
                                            className={cn(
                                                "h-8 w-8 rounded-full border border-white/20 transition-transform hover:scale-110 flex items-center justify-center",
                                                editForm.data.color === c.value && "ring-2 ring-white"
                                            )}
                                            style={{ backgroundColor: c.value }}
                                        >
                                            {editForm.data.color === c.value && <Check className="h-4 w-4 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 border-t border-white/10 pt-4">
                            <Button type="button" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-white text-black hover:bg-white/90" disabled={editForm.processing}>
                                {editForm.processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}