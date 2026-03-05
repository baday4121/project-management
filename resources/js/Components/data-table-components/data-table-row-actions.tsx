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
        ? "Apakah Anda yakin ingin menghapus proyek ini? Semua data di dalamnya akan hilang permanen."
        : "Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.",
      action: () => onDelete?.(row),
      actionText: "Ya, Hapus",
      variant: "destructive",
    });
  };

  const handleAssignClick = () => {
    showConfirmation({
      title: "Ambil Tugas",
      description: "Apakah Anda yakin ingin mengambil dan mengerjakan tugas ini?",
      action: () => onAssign?.(row),
      actionText: "Ambil",
    });
  };

  const handleUnassignClick = () => {
    showConfirmation({
      title: "Lepas Tugas",
      description: "Apakah Anda yakin ingin berhenti mengerjakan tugas ini?",
      action: () => onUnassign?.(row),
      actionText: "Lepas",
    });
  };

  const handleLeaveClick = () => {
    showConfirmation({
      title: "Keluar dari Proyek",
      description: "Apakah Anda yakin ingin keluar dari kolaborasi proyek ini?",
      action: () => onLeave?.(row),
      actionText: "Keluar",
      variant: "destructive",
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
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-primary/10 transition-colors"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Buka menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] p-1.5 animate-in fade-in zoom-in duration-200">
          
          {/* Aksi Standar */}
          {onView && (
            <DropdownMenuItem onClick={() => onView(row)} className="gap-2 cursor-pointer font-medium">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>Lihat Detail</span>
            </DropdownMenuItem>
          )}

          {canEditTask && onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer font-medium">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              <span>Edit Data</span>
            </DropdownMenuItem>
          )}

          {!isProjectTable && (
            <>
              {canBeAssigned && onAssign && (
                <DropdownMenuItem onClick={handleAssignClick} className="gap-2 cursor-pointer font-medium text-primary focus:text-primary">
                  <UserPlus className="h-4 w-4" />
                  <span>Ambil Tugas</span>
                </DropdownMenuItem>
              )}

              {isAssignedToCurrentUser && onUnassign && (
                <DropdownMenuItem onClick={handleUnassignClick} className="gap-2 cursor-pointer font-medium text-orange-600 focus:text-orange-600">
                  <UserMinus className="h-4 w-4" />
                  <span>Lepas Tugas</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* Aksi Kustom */}
          {customActions.map((action, index) => (
            <div key={index}>
              <DropdownMenuItem onClick={() => action.onClick(row)} className="gap-2 cursor-pointer font-medium">
                {action.icon && <action.icon className="h-4 w-4 text-muted-foreground" />}
                <span>{action.label}</span>
              </DropdownMenuItem>
              {action.showSeparator && <DropdownMenuSeparator />}
            </div>
          ))}

          {/* Aksi Berbahaya */}
          {(isProjectTable && !isCreator && onLeave) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 cursor-pointer font-bold text-destructive focus:bg-destructive focus:text-destructive-foreground" 
                onClick={handleLeaveClick}
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar Proyek</span>
              </DropdownMenuItem>
            </>
          )}

          {shouldShowDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 cursor-pointer font-bold text-destructive focus:bg-destructive focus:text-destructive-foreground" 
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
                <span>
                  {isProjectTable && isCreator ? "Hapus Proyek" : "Hapus Data"}
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog />
    </>
  );
}