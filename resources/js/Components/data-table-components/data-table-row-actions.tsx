import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, UserPlus, UserMinus, LogOut } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { LucideIcon } from "lucide-react";

interface CustomAction {
  icon: LucideIcon;
  label: string;
  onClick: (row: Row<any>) => void;
  showSeparator?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onView?: (row: Row<TData>) => void;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
  onAssign?: (row: Row<TData>) => void;
  onUnassign?: (row: Row<TData>) => void;
  onLeave?: (row: Row<TData>) => void;
  canEdit?: boolean;
  isProjectTable?: boolean;
  isCreator?: boolean;
  customActions?: CustomAction[];
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  onAssign,
  onUnassign,
  onLeave,
  canEdit = true,
  isProjectTable = false,
  isCreator = false,
  customActions = [],
}: DataTableRowActionsProps<TData>) {
  const { auth } = usePage<PageProps>().props;
  const task = row.original as any;
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const assignedUserId = task.assigned_user_id ?? task.assignedUser?.id;
  const canBeAssigned = !assignedUserId;
  const isAssignedToCurrentUser = assignedUserId === auth.user.id;
  const canEditTask = isAssignedToCurrentUser || canEdit;

  const handleDeleteClick = () => {
    showConfirmation({
      title: isProjectTable ? "Hapus Proyek" : "Hapus Tugas",
      description: isProjectTable 
        ? "Apakah Anda yakin ingin menghapus proyek ini? Semua data terkait akan ikut terhapus dan tindakan ini tidak dapat dibatalkan."
        : "Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.",
      action: () => onDelete?.(row),
      actionText: "Ya, Hapus",
    });
  };

  const handleAssignClick = () => {
    showConfirmation({
      title: "Ambil Tugas",
      description: "Apakah Anda yakin ingin menugaskan tugas ini ke akun Anda?",
      action: () => onAssign?.(row),
      actionText: "Tugaskan",
    });
  };

  const handleUnassignClick = () => {
    showConfirmation({
      title: "Lepas Tugas",
      description: "Apakah Anda yakin ingin melepaskan diri dari tugas ini?",
      action: () => onUnassign?.(row),
      actionText: "Lepaskan",
    });
  };

  const handleLeaveClick = () => {
    showConfirmation({
      title: "Keluar Proyek",
      description: "Apakah Anda yakin ingin keluar dari proyek ini?",
      action: () => onLeave?.(row),
      actionText: "Keluar",
    });
  };

  const shouldShowDelete =
    onDelete &&
    (isProjectTable ? isCreator : (task.can?.delete ?? true));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted/80"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Buka menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] p-1.5 shadow-lg border-muted/50">
          
          {/* Aksi Utama */}
          {onView && (
            <DropdownMenuItem onClick={() => onView(row)} className="gap-2 cursor-pointer">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>Lihat Detail</span>
            </DropdownMenuItem>
          )}

          {canEditTask && onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              <span>Ubah Data</span>
            </DropdownMenuItem>
          )}

          {!isProjectTable && (
            <>
              {canBeAssigned && onAssign && (
                <DropdownMenuItem onClick={handleAssignClick} className="gap-2 cursor-pointer text-primary focus:text-primary">
                  <UserPlus className="h-4 w-4" />
                  <span>Tugaskan ke Saya</span>
                </DropdownMenuItem>
              )}

              {isAssignedToCurrentUser && onUnassign && (
                <DropdownMenuItem onClick={handleUnassignClick} className="gap-2 cursor-pointer text-orange-600 focus:text-orange-600">
                  <UserMinus className="h-4 w-4" />
                  <span>Lepas Penugasan</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* Aksi Kustom */}
          {customActions.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {customActions.map((action, index) => (
                <div key={index}>
                  <DropdownMenuItem onClick={() => action.onClick(row)} className="gap-2 cursor-pointer">
                    {action.icon && <action.icon className="h-4 w-4 text-muted-foreground" />}
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                  {action.showSeparator && <DropdownMenuSeparator />}
                </div>
              ))}
            </>
          )}

          {/* Aksi Berbahaya / Destruktif */}
          {((isProjectTable && !isCreator && onLeave) || shouldShowDelete) && (
             <DropdownMenuSeparator />
          )}

          {isProjectTable && !isCreator && onLeave && (
            <DropdownMenuItem 
              className="text-red-500 gap-2 cursor-pointer focus:bg-red-50 focus:text-red-600" 
              onClick={handleLeaveClick}
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Proyek</span>
            </DropdownMenuItem>
          )}

          {shouldShowDelete && (
            <DropdownMenuItem 
              className="text-red-600 font-medium gap-2 cursor-pointer focus:bg-red-50 focus:text-red-600" 
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {isProjectTable && isCreator ? "Hapus Proyek" : "Hapus"}
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog />
    </>
  );
}