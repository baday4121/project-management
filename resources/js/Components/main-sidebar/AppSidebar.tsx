import { ListTodo, SquareChartGantt, Users, LayoutDashboard } from "lucide-react";
import { RolesEnum } from "@/types/enums";

import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Components/ui/sidebar";
import { NavHeader } from "./NavHeader";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import NavThemeToggle from "./NavThemeToggle";
import { NavTasks } from "./NavTasks";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth, recentProjects, recentTasks } = usePage<PageProps>().props;

  const data = {
    user: {
      name: auth.user.name,
      email: auth.user.email,
      avatar: auth.user.profile_picture
        ? `/storage/${auth.user.profile_picture}`
        : null,
    },
    navMain: [
      {
        title: "Beranda",
        url: route("dashboard"),
        icon: LayoutDashboard,
      },
      {
        title: "Proyek",
        url: route("project.index"),
        icon: SquareChartGantt,
        items: [
          {
            title: "Semua Proyek",
            url: route("project.index"),
          },
          {
            title: "Undangan",
            url: route("project.invitations"),
          },
        ],
      },
      {
        title: "Tugas",
        url: route("task.index"),
        icon: ListTodo,
        items: [
          {
            title: "Semua Tugas",
            url: route("task.index"),
          },
          {
            title: "Tugas Saya",
            url: route("task.myTasks"),
          },
        ],
      },
      // Tampilkan menu Pengguna hanya jika user adalah admin
      ...(auth.user.roles?.includes(RolesEnum.Admin)
        ? [
            {
              title: "Pengguna",
              url: route("user.index"),
              icon: Users,
            },
          ]
        : []),
    ],
    projects: recentProjects.map((project) => ({
      name: project.name,
      url: route("project.show", project.id),
      status: project.status,
      permissions: project.permissions,
    })),
    tasks: recentTasks.map((task) => ({
      id: task.id,
      name: task.name,
      url: route("task.show", task.id),
      labels: task.labels,
      permissions: task.permissions,
    })),
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/5 shadow-xl" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="gap-2 px-2">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavTasks tasks={data.tasks} />
      </SidebarContent>
      <SidebarFooter className="border-t border-primary/5 bg-muted/20 pb-4">
        <NavThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}