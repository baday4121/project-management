import { Eye, MoreHorizontal, Pencil, Trash2, UserMinus, ListTodo } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Badge } from "@/Components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/Components/ui/sidebar";
import { Label } from "@/types/task";
import { truncateText } from "@/utils/helpers";

type TaskWithPermissions = {
  id: number;
  name: string;
  url: string;
  labels: Label[];
  permissions: {
    canDelete: boolean;
  };
};

export function NavTasks({ tasks }: { tasks: TaskWithPermissions[] }) {
  const { isMobile } = useSidebar();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  if (tasks.length === 0) {
    return null;
  }

  const handleDeleteClick = (taskId: string) => {
    showConfirmation({
      title: "Konfirmasi Penghapusan Tugas",
      description:
        "Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.",
      action: () => router.delete(route("task.destroy", taskId)),
      actionText: "Hapus",
    });
  };

  const handleUnassignClick = (taskId: string) => {
    showConfirmation({
      title: "Konfirmasi Pelepasan Tugas",
      description: "Apakah Anda yakin ingin berhenti mengerjakan tugas ini?",
      action: () =>
        router.post(route("task.unassign", taskId), {
          preserveScroll: true,
        }),
      actionText: "Lepaskan",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
        Tugas Terbaru
      </SidebarGroupLabel>
      <SidebarMenu>
        {tasks.map((item, index) => (
          <SidebarMenuItem key={`${item.name}-${index}`} title={item.name}>
            <SidebarMenuButton asChild className="transition-colors hover:bg-primary/5">
              <Link href={item.url} className="flex items-center gap-2">
                <div className="flex shrink-0 gap-1">
                  {item.labels.slice(0, 1).map((label) => (
                    <Badge 
                      key={label.id} 
                      variant={label.variant} 
                      className="px-1 py-0 text-[10px] uppercase font-bold tracking-tighter"
                    >
                      {truncateText(label.name, 10)}
                    </Badge>
                  ))}
                  {item.labels.length === 0 && (
                    <ListTodo className="h-3.5 w-3.5 text-muted-foreground/50" />
                  )}
                </div>
                <span className="truncate font-medium">{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover className="hover:bg-primary/10 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-xl shadow-xl border-primary/5"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onSelect={() => router.get(item.url)} className="gap-2 cursor-pointer">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Lihat Tugas</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onSelect={() =>
                    router.get(route("task.edit", item.url.split("/").pop()))
                  }
                  className="gap-2 cursor-pointer"
                >
                  <Pencil className="h-4 w-4 text-primary" />
                  <span>Edit Tugas</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => handleUnassignClick(item.url.split("/").pop()!)}
                  className="gap-2 cursor-pointer"
                >
                  <UserMinus className="h-4 w-4 text-primary" />
                  <span>Lepas Tugas</span>
                </DropdownMenuItem>

                {item.permissions.canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 gap-2 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                      onSelect={() => handleDeleteClick(item.url.split("/").pop()!)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Hapus Tugas</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="hover:bg-primary/5">
            <Link href={route("task.index")} className="flex items-center gap-2">
              <MoreHorizontal className="h-4 w-4 text-sidebar-foreground/70" />
              <span className="text-muted-foreground">Lihat Semua</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <ConfirmationDialog />
    </SidebarGroup>
  );
}