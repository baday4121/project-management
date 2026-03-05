import { Head, useForm } from "@inertiajs/react";
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
import { PaginatedUser } from "@/types/user";
import MultipleSelector, { Option } from "@/Components/ui/multiple-selector";
import { TaskLabelBadgeVariant } from "@/utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";
import RichTextEditor from "@/Components/RichTextEditor";
import { 
  ClipboardPlus, 
  Layers, 
  ImagePlus, 
  Tag, 
  AlignLeft, 
  Calendar, 
  Flag, 
  UserCircle, 
  ArrowLeft,
  Loader2
} from "lucide-react";

type Props = {
  projects: PaginatedProject;
  users: PaginatedUser;
  labels: {
    data: Option[];
  };
  currentUserId: number;
  selectedProjectId?: number;
  fromProjectPage?: boolean;
  statusOptions: Array<{
    value: number | string;
    label: string;
  }>;
  selectedStatusId?: string;
};

export default function Create({
  projects,
  users: initialUsers,
  labels: initialLabels,
  currentUserId,
  selectedProjectId,
  fromProjectPage,
  statusOptions: initialStatusOptions,
  selectedStatusId,
}: Props) {
  const [canAssignOthers, setCanAssignOthers] = useState(true);
  const [users, setUsers] = useState<PaginatedUser>(initialUsers || { data: [] });
  const [statusOptions, setStatusOptions] = useState(initialStatusOptions);
  const [showFields, setShowFields] = useState(Boolean(selectedProjectId));
  const [key, setKey] = useState(0);

  const isProjectSelectionDisabled = Boolean(selectedProjectId && fromProjectPage);

  const { data, setData, post, errors, reset, processing } = useForm({
    image: null as File | null,
    name: "",
    description: "",
    status_id: selectedStatusId || "",
    due_date: "",
    priority: "",
    assigned_user_id: canAssignOthers ? "" : currentUserId.toString(),
    project_id: selectedProjectId?.toString() || "",
    label_ids: [] as number[],
  });

  const [availableLabels, setAvailableLabels] = useState<Option[]>(
    initialLabels.data.map((label) => ({
      label: label.name as string,
      value: (label.id ?? "").toString(),
      variant: label.variant as TaskLabelBadgeVariant,
    })),
  );

  const [isLoadingLabels, setIsLoadingLabels] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);

  const searchLabels = async (query: string): Promise<Option[]> => {
    if (!data.project_id) return [];
    return availableLabels.filter((label) =>
      label.label.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const fetchProjectLabels = async (projectId: string) => {
    if (!projectId) return;
    setIsLoadingLabels(true);
    try {
      const response = await axios.get(route("task.labels", projectId));
      if (response.data.data) {
        const labels = response.data.data.map((label: any) => ({
          label: label.name,
          value: label.id.toString(),
          variant: label.variant as TaskLabelBadgeVariant,
        }));
        setAvailableLabels(labels);
        setKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Gagal mengambil label proyek:", error);
    } finally {
      setIsLoadingLabels(false);
    }
  };

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("task.store"), {
      preserveState: true,
      onSuccess: () => {
        reset();
        toast({
          title: "Berhasil",
          description: "Tugas baru telah dibuat.",
          variant: "success",
        });
      },
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Gagal membuat tugas",
          variant: "destructive",
          description: errorMessage,
        });
      },
    });
  };

  const checkProjectRole = async (projectId: string) => {
    try {
      const response = await axios.get(route("project.check-role", projectId));
      const isProjectMember = response.data.isProjectMember;
      setCanAssignOthers(!isProjectMember);

      if (isProjectMember) {
        setData("assigned_user_id", currentUserId.toString());
        setUsers({
          data: [
            {
              id: currentUserId,
              name: initialUsers.data.find((u) => u.id === currentUserId)?.name || "",
              email: initialUsers.data.find((u) => u.id === currentUserId)?.email || "",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Gagal memeriksa peran proyek:", error);
    }
  };

  const fetchProjectUsers = async (projectId: string) => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get(route("task.users", projectId));
      setUsers(response.data.users || { data: [] });
    } catch (error) {
      console.error("Gagal mengambil pengguna proyek:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchProjectStatuses = async (projectId: string) => {
    setIsLoadingStatuses(true);
    try {
      const response = await axios.get(route("task.statuses", projectId));
      if (response.data.statusOptions) {
        setStatusOptions(response.data.statusOptions);
      }
    } catch (error) {
      console.error("Gagal mengambil status proyek:", error);
    } finally {
      setIsLoadingStatuses(false);
    }
  };

  const handleProjectChange = async (projectId: string) => {
    setData((prev) => ({
      ...prev,
      project_id: projectId,
      label_ids: [],
      status_id: "",
      assigned_user_id: "",
    }));

    try {
      await Promise.all([
        checkProjectRole(projectId),
        fetchProjectUsers(projectId),
        fetchProjectLabels(projectId),
        !selectedStatusId ? fetchProjectStatuses(projectId) : Promise.resolve(),
      ]);
      setShowFields(true);
    } catch (error) {
      console.error("Gagal mengambil data proyek:", error);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      handleProjectChange(selectedProjectId.toString());
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedStatusId) {
      setData("status_id", selectedStatusId);
    }
  }, [selectedStatusId]);

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardPlus className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
              Buat Tugas Baru
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      }
    >
      <Head title="Buat Tugas" />

      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-muted/20 pb-6">
              <CardTitle className="text-2xl font-bold">Detail Tugas</CardTitle>
              <CardDescription>
                {data.project_id 
                  ? `Menambahkan tugas untuk proyek: ${projects.data.find((p) => p.id.toString() === data.project_id)?.name}`
                  : "Silakan pilih proyek untuk mulai mengisi detail tugas."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-8">
                
                {/* Pemilihan Proyek */}
                <div className="space-y-3">
                  <Label htmlFor="task_project_id" className="flex items-center gap-2 font-semibold">
                    <Layers className="h-4 w-4 text-primary" /> Proyek <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={handleProjectChange}
                    defaultValue={selectedProjectId?.toString()}
                    disabled={isProjectSelectionDisabled}
                    required
                  >
                    <SelectTrigger className="h-11 shadow-sm">
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
                  <InputError message={errors.project_id} />
                </div>

                {showFields && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Nama Tugas */}
                      <div className="space-y-3">
                        <Label htmlFor="task_name" className="flex items-center gap-2 font-semibold">
                          <AlignLeft className="h-4 w-4 text-primary" /> Nama Tugas <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="task_name"
                          placeholder="Contoh: Desain Landing Page"
                          className="h-11 shadow-sm"
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          required
                          autoFocus
                        />
                        <InputError message={errors.name} />
                      </div>

                      {/* Gambar Tugas */}
                      <div className="space-y-3">
                        <Label htmlFor="task_image_path" className="flex items-center gap-2 font-semibold">
                          <ImagePlus className="h-4 w-4 text-primary" /> Gambar Tugas <span className="text-xs font-normal text-muted-foreground ml-1">(Opsional)</span>
                        </Label>
                        <Input
                          id="task_image_path"
                          type="file"
                          className="cursor-pointer h-11 pt-2 shadow-sm"
                          accept=".jpg,.jpeg,.png,.webp,.svg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setData("image", e.target.files[0]);
                            }
                          }}
                        />
                        <InputError message={errors.image} />
                      </div>
                    </div>

                    {/* Label Tugas */}
                    <div className="space-y-3">
                      <Label htmlFor="task_labels" className="flex items-center gap-2 font-semibold">
                        <Tag className="h-4 w-4 text-primary" /> Label Tugas <span className="text-xs font-normal text-muted-foreground ml-1">(Opsional)</span>
                      </Label>
                      <MultipleSelector
                        key={key}
                        defaultOptions={availableLabels}
                        placeholder={isLoadingLabels ? "Memuat label..." : "Pilih label..."}
                        emptyIndicator={<span className="text-sm p-2">Label tidak ditemukan</span>}
                        onSearch={searchLabels}
                        triggerSearchOnFocus
                        className="min-h-11 shadow-sm"
                        onChange={(selectedLabels) =>
                          setData("label_ids", selectedLabels.map((label) => Number(label.value)))
                        }
                        value={data.label_ids.map((id) => availableLabels.find((l) => Number(l.value) === id)).filter(Boolean) as Option[]}
                        disabled={isLoadingLabels || !data.project_id}
                      />
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-3">
                      <Label htmlFor="task_description" className="flex items-center gap-2 font-semibold">
                        <AlignLeft className="h-4 w-4 text-primary" /> Deskripsi Tugas <span className="text-red-500">*</span>
                      </Label>
                      <div className="rounded-md border shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-primary">
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
                        <Label htmlFor="task_due_date" className="flex items-center gap-2 font-semibold">
                          <Calendar className="h-4 w-4 text-primary" /> Tenggat Waktu <span className="text-xs font-normal text-muted-foreground ml-1">(Opsional)</span>
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
                        <Label htmlFor="task_status" className="flex items-center gap-2 font-semibold">
                          {isLoadingStatuses ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4 text-primary" />} 
                          Status <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => setData("status_id", value)}
                          value={data.status_id?.toString()}
                          disabled={isLoadingStatuses}
                          required
                        >
                          <SelectTrigger className="h-11 shadow-sm">
                            <SelectValue placeholder={isLoadingStatuses ? "Memuat..." : "Pilih Status"} />
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
                        <Label htmlFor="task_priority" className="flex items-center gap-2 font-semibold">
                          <Flag className="h-4 w-4 text-primary" /> Prioritas <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(value) => setData("priority", value)} defaultValue={data.priority} required>
                          <SelectTrigger className="h-11 shadow-sm">
                            <SelectValue placeholder="Pilih Prioritas" />
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

                    {/* Penugasan Pengguna */}
                    <div className="space-y-3">
                      <Label htmlFor="task_assigned_user" className="flex items-center gap-2 font-semibold">
                        {isLoadingUsers ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCircle className="h-4 w-4 text-primary" />}
                        Ditugaskan Kepada <span className="text-xs font-normal text-muted-foreground ml-1">(Opsional)</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setData("assigned_user_id", value === "unassigned" ? "" : value)}
                        value={data.assigned_user_id || "unassigned"}
                        disabled={isLoadingUsers}
                      >
                        <SelectTrigger className="h-11 shadow-sm">
                          <SelectValue placeholder={isLoadingUsers ? "Memuat anggota..." : "Pilih Pengguna"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Belum Ditugaskan</SelectItem>
                          {users.data.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <InputError message={errors.assigned_user_id} />
                    </div>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-3 border-t pt-8">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    disabled={processing}
                  >
                    Batal
                  </Button>
                  {showFields && (
                    <Button type="submit" className="px-8 font-semibold" disabled={processing}>
                      {processing ? "Memproses..." : "Buat Tugas"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}