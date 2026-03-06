import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Download, ExternalLink, FileIcon, ImageIcon, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Input } from "@/Components/ui/input";

export default function Assets({ project, assets }: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssets = assets.filter((asset: any) =>
    asset.task_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper untuk memastikan path gambar benar
  const getAssetUrl = (url: string) => {
    if (!url) return "/images/placeholder.png";
    if (url.startsWith("http")) return url;
    return `/storage/${url}`;
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center gap-4">
          <Link href={route('project.show', project.id)}>
             <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
             </Button>
          </Link>
          <h2 className="text-xl font-black tracking-tight">{project.name} — Galeri Aset</h2>
        </div>
      }
    >
      <Head title={`Aset Proyek - ${project.name}`} />

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-3xl font-black tracking-tighter text-primary">File & Lampiran</h3>
            <p className="text-muted-foreground font-medium">Manajemen aset terpusat untuk efisiensi tim.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama tugas..."
              className="pl-10 h-11 rounded-xl border-primary/10 bg-card/50 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAssets.map((asset: any, index: number) => (
              <Card key={index} className="group overflow-hidden rounded-[2rem] border-primary/5 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                <div className="aspect-square relative flex items-center justify-center bg-muted/30 overflow-hidden">
                  {['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(asset.type.toLowerCase()) ? (
                    <img 
                      src={getAssetUrl(asset.url)} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={asset.task_name}
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.png"; // Pastikan kamu punya file ini di folder public/images
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FileIcon className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{asset.type}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-10 backdrop-blur-[2px]">
                     <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-xl hover:scale-110" asChild title="Unduh File">
                        <a href={getAssetUrl(asset.url)} download><Download className="h-5 w-5" /></a>
                     </Button>
                     <Link href={route('project.show', { project: project.id, tab: 'tasks' })}>
                        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-xl hover:scale-110" title="Buka Tugas">
                           <ExternalLink className="h-5 w-5" />
                        </Button>
                     </Link>
                  </div>
                </div>

                <div className="p-5">
                  <p className="truncate text-sm font-bold tracking-tight" title={asset.task_name}>
                    {asset.task_name}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{asset.date}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-primary/10 rounded-[3rem] bg-muted/5">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <ImageIcon className="h-10 w-10 text-primary/20" />
            </div>
            <p className="text-xl font-bold text-muted-foreground/50">Belum ada aset ditemukan</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}