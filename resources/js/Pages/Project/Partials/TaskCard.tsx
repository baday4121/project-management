import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { router } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  Eye,
  MoreHorizontal,
  Pencil,
  UserMinus,
  UserPlus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useState } from "react";
import { MoveTaskDialog } from "./MoveTaskDialog";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { KanbanColumn } from "@/types/kanban";

type Props = {
  task: Task;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  isDragging?: boolean;
  columns: KanbanColumn[];
};

export function TaskCard({ task, permissions, isDragging = false, columns }: Props) {
  const [isUsingDropdown, setIsUsingDropdown] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const canDragTask = permissions.canManageBoard || task.can.move;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
    disabled: !canDragTask || isUsingDropdown,
  });

  const handleDropdownOpenChange = (open: boolean) => {
    setIsUsingDropdown(open);
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleAssign = () => {
    showConfirmation({
      title: "Konfirmasi Penugasan",
      description: "Apakah Anda yakin ingin mengambil tugas ini untuk dikerjakan sendiri?",
      action: () =>
        router.post(route("task.assignToMe", task.id), {}, { preserveScroll: true }),
      actionText: "Ambil Tugas",
    });
  };

  const handleUnassign = () => {
    showConfirmation({
      title: "Konfirmasi Pelepasan",
      description: "Apakah Anda yakin ingin berhenti mengerjakan tugas ini?",
      action: () =>
        router.post(route("task.unassign", task.id), {}, { preserveScroll: true }),
      actionText: "Lepas Tugas",
    });
  };

  const handleDelete = () => {
    showConfirmation({
      title: "Hapus Tugas",
      description:
        "Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini bersifat permanen.",
      action: () => router.delete(route("task.destroy", task.id)),
      actionText: "Hapus",
      variant: "destructive",
    });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(canDragTask && !isUsingDropdown ? { ...attributes, ...listeners } : {})}
        className={cn(
          "group relative rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30",
          canDragTask && !isUsingDropdown && "cursor-grab active:cursor-grabbing",
          isDragging && "opacity-50 ring-2 ring-primary",
          !canDragTask && "opacity-90 bg-muted/50",
        )}
      >
        {/* Indikator Prioritas (Opsional: Jika ada data priority) */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
              #{task.task_number}
            </span>
            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.slice(0, 2).map((label) => (
                  <Badge key={label.id} variant={label.variant} className="text-[9px] px-1.5 py-0 uppercase font-black">
                    {label.name}
                  </Badge>
                ))}
                {task.labels.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">+{task.labels.length - 2}</span>
                )}
              </div>
            )}
          </div>

          <div onMouseDown={(e) => e.stopPropagation()}>
            <DropdownMenu onOpenChange={handleDropdownOpenChange}>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.visit(route("task.show", task.id))} className="gap-2">
                  <Eye className="h-4 w-4" /> <span>Lihat Detail</span>
                </DropdownMenuItem>
                
                {task.can.edit && (
                  <DropdownMenuItem onClick={() => router.visit(route("task.edit", task.id))} className="gap-2">
                    <Pencil className="h-4 w-4" /> <span>Edit Tugas</span>
                  </DropdownMenuItem>
                )}

                {task.can.assign && (
                  <DropdownMenuItem onClick={handleAssign} className="gap-2 text-primary focus:text-primary">
                    <UserPlus className="h-4 w-4" /> <span>Ambil Tugas</span>
                  </DropdownMenuItem>
                )}

                {task.can.unassign && (
                  <DropdownMenuItem onClick={handleUnassign} className="gap-2 text-orange-600 focus:text-orange-600">
                    <UserMinus className="h-4 w-4" /> <span>Lepas Tugas</span>
                  </DropdownMenuItem>
                )}

                {canDragTask && (
                  <MoveTaskDialog
                    taskId={task.id}
                    currentColumnId={task.kanban_column_id}
                    columns={columns}
                  />
                )}

                {task.can.delete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="gap-2 text-red-500 focus:text-red-500">
                      <Trash2 className="h-4 w-4" /> <span>Hapus Tugas</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h4 className="line-clamp-2 text-sm font-bold leading-snug mb-4 group-hover:text-primary transition-colors">
          {task.name}
        </h4>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-dashed">
          <div className="flex items-center gap-2">
            {task.assignedUser ? (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5 border ring-1 ring-background">
                  <AvatarImage src={task.assignedUser.profile_picture} />
                  <AvatarFallback className="text-[10px]">{task.assignedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-medium text-muted-foreground max-w-[80px] truncate">
                  {task.assignedUser.name}
                </span>
              </div>
            ) : (
              <Badge variant="outline" className="text-[10px] font-normal border-dashed text-muted-foreground px-1.5">
                Belum Ditugaskan
              </Badge>
            )}
          </div>

          {task.due_date && (
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-bold",
              new Date(task.due_date) < new Date() ? "text-red-500" : "text-muted-foreground"
            )}>
              <CalendarClock className="h-3 w-3" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}
        </div>
        
        {/* Handle Visual untuk Drag */}
        {canDragTask && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <ConfirmationDialog />
    </>
  );
}