import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Plus, Trash2, Pin } from "lucide-react";

export default function NotesIndex({ notes }: any) {
  const { data, setData, post, reset } = useForm({
    title: '',
    content: '',
    color: '#1f2937'
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('notes.store'), { onSuccess: () => reset() });
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-bold">Catatan Saya</h2>}>
      <Head title="Notes" />
      
      <div className="py-12 px-4 max-w-6xl mx-auto">
        {/* Input Form ala Google Keep */}
        <form onSubmit={submit} className="mb-12 max-w-xl mx-auto space-y-2 bg-card p-4 rounded-xl border shadow-lg">
          <input 
            placeholder="Judul" 
            className="w-full bg-transparent border-none focus:ring-0 font-bold"
            value={data.title} onChange={e => setData('title', e.target.value)}
          />
          <textarea 
            placeholder="Buat catatan..." 
            className="w-full bg-transparent border-none focus:ring-0 resize-none"
            value={data.content} onChange={e => setData('content', e.target.value)}
          />
          <div className="flex justify-end">
            <Button size="sm" type="submit"><Plus className="w-4 h-4 mr-1"/> Tambah</Button>
          </div>
        </form>

        {/* Grid Catatan */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {notes.map((note: any) => (
            <Card key={note.id} className="break-inside-avoid p-4 group transition-all hover:shadow-md" style={{ backgroundColor: note.color }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{note.title}</h3>
                <Pin className={cn("w-4 h-4 cursor-pointer", note.is_pinned ? "text-primary" : "opacity-20")} />
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
              <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}