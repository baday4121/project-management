import { Task } from "@/types/task";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { router } from "@inertiajs/react";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
} from "@/utils/constants";
import { Link } from "@inertiajs/react";

import { ChevronRight, Pencil, Plus, Trash2, FolderKanban, Hash } from "lucide-react";

type TaskHeaderProps = {
  task: Task;
};

export function TaskHeader({ task }: TaskHeaderProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = () => {
    showConfirmation({
      title: "Hapus Tugas",
      description:
        "Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan hilang.",
      action: () => router.delete(route("task.destroy", task.id)),
      actionText: "Ya, Hapus",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 rounded-2xl border bg-card/50 p-5 shadow-sm backdrop-blur-sm sm:p-8 overflow-hidden relative">
      {/* Background Accent / Dekorasi halus */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

      {/* Navigasi Breadcrumb */}
      <nav className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Link
          href={route("project.show", task.project.id)}
          className="flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          <FolderKanban className="h-3.5 w-3.5" />
          {task.project.name}
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <div className="flex items-center gap-1 opacity-70">
          <Hash className="h-3 w-3" />
          Tugas #{task.task_number}
        </div>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <div className="space-y-4">
          {/* Judul Tugas */}
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl italic">
            {task.name}
          </h1>

          {/* Badge Status & Prioritas */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={TASK_STATUS_BADGE_MAP(task.status.slug, task.status.color)}
              className="px-3 py-1 font-bold shadow-sm"
            >
              {task.status.name}
            </Badge>
            <Badge 
              variant={TASK_PRIORITY_BADGE_MAP[task.priority]}
              className="px-3 py-1 font-bold shadow-sm uppercase text-[10px]"
            >
              {TASK_PRIORITY_TEXT_MAP[task.priority]}
            </Badge>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
          <Link href={route("task.create", { project_id: task.project_id })} className="w-full sm:w-auto">
            <Button size="sm" className="w-full font-bold shadow-lg shadow-primary/20 sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Tugas Baru
            </Button>
          </Link>
          
          {task.can.edit && (
            <Link href={route("task.edit", task.id)} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full font-bold border-primary/20 hover:bg-primary/5 sm:w-auto">
                <Pencil className="mr-2 h-4 w-4 text-primary" />
                Edit
              </Button>
            </Link>
          )}
          
          {task.can.delete && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full font-bold text-destructive hover:bg-destructive/10 sm:w-auto"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          )}
        </div>
      </div>

      <ConfirmationDialog />
    </div>
  );
}