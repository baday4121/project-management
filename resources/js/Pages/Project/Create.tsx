import { Head, useForm, Link } from "@inertiajs/react";
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
import { getStatusOptions } from "@/utils/constants";
import { FolderPlus, ImagePlus, Calendar, Info, ArrowLeft } from "lucide-react";

export default function Create() {
  const { data, setData, post, errors, reset, processing } = useForm({
    image: null as File | null,
    name: "",
    description: "",
    status: "",
    due_date: "",
  });

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post(route("project.store"), {
      preserveState: true,
      onSuccess: () => {
        reset();
        toast({
          title: "Berhasil",
          description: "Proyek baru telah berhasil dibuat.",
          variant: "success",
        });
      },
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Gagal membuat proyek",
          variant: "destructive",
          description: errorMessage,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
              Buat Proyek Baru
            </h2>
          </div>
          <Link href={route("project.index")}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <Head title="Buat Proyek" />

      <div className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5">
            <CardHeader className="space-y-1 border-b bg-muted/20 pb-6">
              <CardTitle className="text-2xl font-black">Detail Proyek</CardTitle>
              <CardDescription>
                Isi informasi di bawah ini untuk memulai kolaborasi tim Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-8">
                
                {/* Gambar Proyek */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="flex items-center gap-2 font-bold">
                    <ImagePlus className="h-4 w-4 text-primary" />
                    Thumbnail Proyek <span className="text-xs font-normal text-muted-foreground">(Opsional)</span>
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    className="cursor-pointer h-11 pt-2 shadow-sm focus:ring-primary/20"
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
                  <Label htmlFor="project_name" className="flex items-center gap-2 font-bold">
                    <Info className="h-4 w-4 text-primary" />
                    Nama Proyek <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="project_name"
                    placeholder="Contoh: Aplikasi SaaS POS"
                    className="h-11 shadow-sm focus:ring-primary/20"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                {/* Deskripsi Proyek */}
                <div className="space-y-3">
                  <Label htmlFor="project_description" className="font-bold">Deskripsi <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="project_description"
                    placeholder="Jelaskan tujuan dan ruang lingkup proyek ini..."
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
                    <Label htmlFor="project_due_date" className="flex items-center gap-2 font-bold">
                      <Calendar className="h-4 w-4 text-primary" />
                      Tenggat Waktu <span className="text-xs font-normal text-muted-foreground">(Opsional)</span>
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
                    <Label htmlFor="project_status" className="font-bold">Status Awal <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) => setData("status", value)}
                      defaultValue={data.status}
                      required
                    >
                      <SelectTrigger className="h-11 shadow-sm">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {getStatusOptions().map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-3 border-t pt-8">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="font-semibold"
                    onClick={() => window.history.back()}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    disabled={processing}
                  >
                    {processing ? "Memproses..." : "Simpan Proyek"}
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