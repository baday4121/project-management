import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";
import { DateTimePicker } from "@/Components/ui/time-picker/date-time-picker";
import { PROJECT_STATUS_TEXT_MAP } from "@/utils/constants";
import { Project } from "@/types/project";
import { Trash2, PencilLine, ImagePlus, Calendar, Info, ArrowLeft, Save } from "lucide-react";

type Props = {
  project: Project;
};

export default function Edit({ project }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    image: null as File | null,
    name: project.name || "",
    description: project.description || "",
    status: project.status || "",
    due_date: project.due_date || "",
    _method: "PUT",
  });

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post(route("project.update", project.id), {
      preserveState: true,
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Data proyek telah diperbarui.",
          variant: "success",
        });
      },
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Gagal memperbarui proyek",
          variant: "destructive",
          description: errorMessage,
        });
      },
    });
  };

  const handleDeleteImage = () => {
    router.delete(route("project.delete-image", project.id), {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Gambar proyek telah dihapus.",
          variant: "success",
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PencilLine className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
              Edit Proyek: {project.name}
            </h2>
          </div>
          <Link href={route("project.show", project.id)}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <Head title={`Edit Proyek - ${project.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5">
            <CardHeader className="space-y-1 border-b bg-muted/20 pb-6">
              <CardTitle className="text-2xl font-black">Perbarui Proyek</CardTitle>
              <CardDescription>
                Sesuaikan informasi detail untuk menjaga tim Anda tetap pada jalurnya.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-8">
                
                {/* Bagian Gambar */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <ImagePlus className="h-3.5 w-3.5 text-primary" /> Thumbnail Proyek
                  </Label>
                  
                  {project.image_path && (
                    <div className="relative group w-full max-w-md overflow-hidden rounded-xl border-2 border-dashed border-muted p-2 transition-all hover:border-primary/20">
                      <img
                        src={project.image_path}
                        alt={project.name}
                        className="rounded-lg object-cover aspect-video"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="font-bold shadow-lg"
                          onClick={handleDeleteImage}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Hapus Gambar
                        </Button>
                      </div>
                    </div>
                  )}

                  <Input
                    id="image"
                    type="file"
                    className="cursor-pointer h-11 pt-2 shadow-sm focus:ring-primary/20 bg-muted/10"
                    accept=".jpg,.jpeg,.png,.webp,.svg"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setData("image", e.target.files[0]);
                      }
                    }}
                  />
                  <InputError message={errors.image} />
                </div>

                {/* Nama Proyek */}
                <div className="space-y-3">
                  <Label htmlFor="project_name" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <Info className="h-3.5 w-3.5 text-primary" /> Nama Proyek <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="project_name"
                    className="h-11 shadow-sm focus:ring-primary/20"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                {/* Deskripsi */}
                <div className="space-y-3">
                  <Label htmlFor="project_description" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Deskripsi <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="project_description"
                    className="min-h-[120px] shadow-sm focus:ring-primary/20 leading-relaxed"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    required
                  />
                  <InputError message={errors.description} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deadline */}
                  <div className="space-y-3">
                    <Label htmlFor="project_due_date" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Tenggat Waktu
                    </Label>
                    <DateTimePicker
                      className="w-full h-11"
                      value={data.due_date ? new Date(data.due_date) : undefined}
                      onChange={(date) =>
                        setData("due_date", date ? date.toISOString() : "")
                      }
                    />
                    <InputError message={errors.due_date} />
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label htmlFor="project_status" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Status Proyek <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) =>
                        setData("status", value as any)
                      }
                      defaultValue={data.status}
                      required
                    >
                      <SelectTrigger className="h-11 shadow-sm">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_STATUS_TEXT_MAP).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-3 border-t pt-8">
                  <Link href={route("project.show", project.id)}>
                    <Button type="button" variant="ghost" className="font-semibold">
                      Batal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="px-8 font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                    disabled={processing}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? "Menyimpan..." : "SIMPAN PERUBAHAN"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}