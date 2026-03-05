import {
  Eye,
  LogOut,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  UsersRound,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { STATUS_CONFIG, type StatusType } from "@/utils/constants";

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

type ProjectWithPermissions = {
  status: StatusType;
  name: string;
  url: string;
  permissions: {
    canEdit: boolean;
    isCreator: boolean;
  };
};

export function NavProjects({ projects }: { projects: ProjectWithPermissions[] }) {
  const { isMobile } = useSidebar();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  if (projects.length === 0 || !projects.some((p) => p.permissions)) {
    return null;
  }

  const handleLeaveClick = (projectId: string) => {
    showConfirmation({
      title: "Konfirmasi Keluar Proyek",
      description: "Apakah Anda yakin ingin keluar dari proyek ini?",
      action: () =>
        router.post(route("project.leave", { project: projectId }), {
          preserveScroll: true,
        }),
      actionText: "Keluar",
    });
  };

  const handleDeleteClick = (projectId: string) => {
    showConfirmation({
      title: "Konfirmasi Penghapusan Proyek",
      description:
        "Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.",
      action: () => router.delete(route("project.destroy", projectId)),
      actionText: "Hapus",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
        Proyek Terbaru
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item, index) => {
          const StatusIcon = STATUS_CONFIG[item.status].icon;
          const projectId = item.url.split("/").pop()!;

          return (
            <SidebarMenuItem key={`${item.name}-${index}`} title={item.name}>
              <SidebarMenuButton asChild className="transition-colors hover:bg-primary/5">
                <Link href={item.url} className="flex items-center gap-2">
                  <span className="shrink-0" title={STATUS_CONFIG[item.status].text}>
                    <StatusIcon
                      className={`h-4 w-4 ${STATUS_CONFIG[item.status].color}`}
                    />
                  </span>
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
                    <span>Lihat Proyek</span>
                  </DropdownMenuItem>

                  {item.permissions.canEdit && (
                    <DropdownMenuItem
                      onSelect={() => router.get(route("project.edit", projectId))}
                      className="gap-2 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 text-primary" />
                      <span>Edit Proyek</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onSelect={() =>
                      router.get(route("task.create", { project_id: projectId }))
                    }
                    className="gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-primary" />
                    <span>Buat Tugas</span>
                  </DropdownMenuItem>

                  {item.permissions.canEdit && (
                    <DropdownMenuItem
                      onSelect={() =>
                        router.get(
                          route("project.show", {
                            project: projectId,
                            tab: "invite",
                          }),
                        )
                      }
                      className="gap-2 cursor-pointer"
                    >
                      <UsersRound className="h-4 w-4 text-primary" />
                      <span>Undang Anggota</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {item.permissions.isCreator ? (
                    <DropdownMenuItem
                      className="text-red-500 gap-2 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                      onSelect={() => handleDeleteClick(projectId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Hapus Proyek</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-red-500 gap-2 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                      onSelect={() => handleLeaveClick(projectId)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar dari Proyek</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="hover:bg-primary/5">
            <Link href={route("project.index")} className="flex items-center gap-2">
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