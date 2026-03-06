import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Plus, Trash2, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotesIndex({ notes }: any) {
  const { data, setData, post, reset, processing } = useForm({
    title: '',
    content: '',
    color: '#1f2937'
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.content.trim()) return;
    
    post(route('notes.store'), { 
      onSuccess: () => reset(),
      preserveScroll: true 
    });
  };

  const togglePin = (id: number) => {
    router.patch(route('notes.pin', id), {}, { preserveScroll: true });
  };

  const deleteNote = (id: number) => {
    if (confirm('Hapus catatan ini?')) {
      router.delete(route('notes.destroy', id), { preserveScroll: true });
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-bold">Catatan Saya</h2>}>
      <Head title="Notes" />
      
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <form 
          onSubmit={submit} 
          className="mb-12 max-w-xl mx-auto space-y-2 bg-card p-4 rounded-xl border border-primary/10 shadow-lg"
        >
          <input 
            placeholder="Judul" 
            className="w-full bg-transparent border-none focus:ring-0 font-bold placeholder:text-muted-foreground/50"
            value={data.title} 
            onChange={e => setData('title', e.target.value)}
          />
          <textarea 
            placeholder="Buat catatan..." 
            className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[100px] placeholder:text-muted-foreground/50"
            value={data.content} 
            onChange={e => setData('content', e.target.value)}
          />
          <div className="flex justify-end pt-2">
            <Button size="sm" type="submit" disabled={processing || !data.content}>
              <Plus className="w-4 h-4 mr-1"/> Tambah
            </Button>
          </div>
        </form>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {notes.map((note: any) => (
            <Card 
              key={note.id} 
              className="break-inside-avoid p-5 group transition-all hover:ring-2 hover:ring-primary/30 border-primary/5" 
              style={{ backgroundColor: note.color }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-foreground tracking-tight">{note.title}</h3>
                <button onClick={() => togglePin(note.id)} type="button">
                  <Pin className={cn(
                    "w-4 h-4 transition-all", 
                    note.is_pinned ? "text-primary fill-primary rotate-45" : "text-muted-foreground opacity-20 group-hover:opacity-100"
                  )} />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>

              <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => deleteNote(note.id)}
                >
                  <Trash2 className="w-4 h-4"/>
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
    </AuthenticatedLayout>
  );
}