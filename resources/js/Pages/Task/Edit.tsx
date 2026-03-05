import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
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
import { PaginatedProject } from "@/types/project";
import { Task } from "@/types/task";
import { PaginatedUser } from "@/types/user";
import MultipleSelector, { Option } from "@/Components/ui/multiple-selector";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Info, Trash2, PencilLine, ImagePlus, Tag, AlignLeft, Calendar, Flag, UserCircle, Layers, ArrowLeft, Save } from "lucide-react";
import { TaskLabelBadgeVariant } from "@/utils/constants";
import { useState } from "react";
import RichTextEditor from "@/Components/RichTextEditor";

type Props = {
  task: Task;
  projects: PaginatedProject;
  users: PaginatedUser;
  labels: {
    data: Option[];
  };
  canChangeAssignee: boolean;
  statusOptions: Array<{
    value: number | string;
    label: string;
  }>;
};

export default function Edit({
  task,
  projects,
  users,
  labels,
  canChangeAssignee,
  statusOptions,
}: Props) {
  const { data, setData, post, errors, processing } = useForm({
    image: null as File | null,
    name: task.name || "",
    description: task.description || "",
    status_id: task.status?.id?.toString() ?? "",
    due_date: task.due_date || "",
    priority: task.priority || "",
    assigned_user_id: task.assigned_user_id
      ? task.assigned_user_id.toString()
      : "unassigned",
    project_id: task.project_id?.toString() || "",
    label_ids: task.labels.map((label) => label.id),
    _method: "PUT",
  });

  const [selectedLabels, setSelectedLabels] = useState<Option[]>(
    task.labels.map((label) => ({
      label: label.name,
      value: label.id.toString(),
      variant: label.variant as TaskLabelBadgeVariant,
    })),
  );

  const labelOptions: Option[] = labels.data.map((label) => ({
    label: label.name as string,
    value: (label.id ?? "").toString(),
    variant: label.variant as TaskLabelBadgeVariant,
  }));

  const searchLabels = async (query: string): Promise<Option[]> => {
    if (!data.project_id) return [];
    return labelOptions.filter((label) =>
      label.label.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const { toast } = useToast();

  const getAssignedUserDisplay = (assignedUserId: string, users: PaginatedUser) => {
    if (!assignedUserId || assignedUserId === "unassigned") {
      return "Belum Ditugaskan";
    }
    const assignedUser = users?.data.find((u) => u.id.toString() === assignedUserId);
    if (!assignedUser) return "Belum Ditugaskan";
    return `${assignedUser.name} (${assignedUser.email})`;
  };

  const handleDeleteImage = () => {
    router.delete(route("task.delete-image", task.id), {
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Gambar tugas telah dihapus.",
          variant: "success",
        });
      },
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("task.update", task.id), {
      preserveState: true,
      onSuccess: () => {
        toast({
          title: "Berhasil",
          description: "Tugas telah diperbarui.",
          variant: "success",
        });
      },
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Gagal memperbarui tugas",
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
            <PencilLine className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
              Edit Tugas: {task.name}
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      }
    >
      <Head title={`Edit Tugas - ${task.name}`} />

      <div className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5">
            <CardHeader className="border-b bg-muted/20 pb-6">
              <CardTitle className="text-2xl font-black">Detail Perubahan</CardTitle>
              <CardDescription>
                Sesuaikan informasi tugas untuk menjaga progres tim tetap berjalan lancar.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-8">
                
                {/* Gambar Tugas Saat Ini */}
                {task.image_path && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <ImagePlus className="h-3.5 w-3.5 text-primary" /> Lampiran Saat Ini
                    </Label>
                    <div className="relative group w-full max-w-md overflow-hidden rounded-xl border-2 border-dashed border-muted p-2 transition-all hover:border-primary/20">
                      <img
                        src={task.image_path}
                        alt={task.name}
                        className="rounded-lg object-cover aspect-video"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="font-black shadow-lg"
                          onClick={handleDeleteImage}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> HAPUS GAMBAR
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pemilihan Proyek (Disabled) */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <Layers className="h-3.5 w-3.5 text-primary" /> Proyek Terkait
                  </Label>
                  <Select
                    defaultValue={data.project_id.toString()}
                    disabled={true}
                  >
                    <SelectTrigger className="h-11 bg-muted/50 border-dashed cursor-not-allowed">
                      <SelectValue placeholder="Pilih Proyek" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.data.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Input Gambar Baru */}
                <div className="space-y-3">
                  <Label htmlFor="task_image_path" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <ImagePlus className="h-3.5 w-3.5 text-primary" /> Ganti Gambar <span className="text-[9px] font-normal text-muted-foreground lowercase">(opsional)</span>
                  </Label>
                  <Input
                    id="task_image_path"
                    type="file"
                    className="cursor-pointer h-11 pt-2 shadow-sm bg-muted/10"
                    accept=".jpg,.jpeg,.png,.webp,.svg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setData("image", e.target.files[0]);
                      }
                    }}
                  />
                  <InputError message={errors.image} />
                </div>

                {/* Nama Tugas */}
                <div className="space-y-3">
                  <Label htmlFor="task_name" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <AlignLeft className="h-3.5 w-3.5 text-primary" /> Nama Tugas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="task_name"
                    placeholder="Masukkan nama tugas..."
                    className="h-11 shadow-sm focus:ring-primary/20"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                {/* Label Tugas */}
                <div className="space-y-3">
                  <Label htmlFor="task_labels" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <Tag className="h-3.5 w-3.5 text-primary" /> Label Tugas
                  </Label>
                  {labels.data.length > 0 ? (
                    <MultipleSelector
                      value={selectedLabels}
                      defaultOptions={labelOptions}
                      placeholder="Pilih label..."
                      emptyIndicator={<span className="text-xs italic p-2">Label tidak ditemukan</span>}
                      onSearch={searchLabels}
                      triggerSearchOnFocus
                      className="min-h-11 shadow-sm"
                      onChange={(labels) => {
                        setSelectedLabels(labels);
                        setData("label_ids", labels.map((l) => Number(l.value)));
                      }}
                    />
                  ) : (
                    <Alert className="bg-primary/5 border-primary/10">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertTitle className="font-bold">Belum ada label</AlertTitle>
                      <AlertDescription className="flex items-center justify-between gap-4">
                        <span>Buat label terlebih dahulu untuk mengkategorikan tugas ini.</span>
                        <Link href={route("task_labels.create", { project_id: data.project_id })}>
                          <Button variant="outline" size="sm" className="font-bold">BUAT LABEL</Button>
                        </Link>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Deskripsi */}
                <div className="space-y-3">
                  <Label htmlFor="task_description" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <AlignLeft className="h-3.5 w-3.5 text-primary" /> Deskripsi Lengkap
                  </Label>
                  <div className="rounded-md border shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <RichTextEditor
                      value={data.description}
                      onChange={(content) => setData("description", content)}
                    />
                  </div>
                  <InputError message={errors.description} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Deadline */}
                  <div className="space-y-3">
                    <Label htmlFor="task_due_date" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Tenggat Waktu
                    </Label>
                    <DateTimePicker
                      className="w-full h-11"
                      value={data.due_date ? new Date(data.due_date) : undefined}
                      onChange={(date) => setData("due_date", date ? date.toISOString() : "")}
                    />
                    <InputError message={errors.due_date} />
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label htmlFor="task_status" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <Layers className="h-3.5 w-3.5 text-primary" /> Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => setData("status_id", value)}
                      value={data.status_id}
                      required
                    >
                      <SelectTrigger className="h-11 shadow-sm">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value.toString()}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.status_id} />
                  </div>

                  {/* Prioritas */}
                  <div className="space-y-3">
                    <Label htmlFor="task_priority" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <Flag className="h-3.5 w-3.5 text-primary" /> Prioritas <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => setData("priority", value as any)}
                      defaultValue={data.priority}
                      required
                    >
                      <SelectTrigger className="h-11 shadow-sm">
                        <SelectValue placeholder="Pilih Urgensi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah (Low)</SelectItem>
                        <SelectItem value="medium">Sedang (Medium)</SelectItem>
                        <SelectItem value="high">Tinggi (High)</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.priority} />
                  </div>
                </div>

                {/* Penanggung Jawab */}
                <div className="space-y-3">
                  <Label htmlFor="task_assigned_user" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <UserCircle className="h-3.5 w-3.5 text-primary" /> Ditugaskan Kepada
                  </Label>
                  <Select
                    onValueChange={(value) => setData("assigned_user_id", value === "unassigned" ? "" : value)}
                    value={data.assigned_user_id || "unassigned"}
                    disabled={!canChangeAssignee}
                  >
                    <SelectTrigger className={`h-11 shadow-sm ${!canChangeAssignee ? 'bg-muted/50 border-dashed cursor-not-allowed' : ''}`}>
                      <SelectValue>
                        {getAssignedUserDisplay(data.assigned_user_id, users)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Belum Ditugaskan</SelectItem>
                      {users?.data.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.assigned_user_id} />
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-3 border-t pt-8">
                  <Link href={route("task.index")}>
                    <Button type="button" variant="ghost" className="font-semibold">
                      Batalkan
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