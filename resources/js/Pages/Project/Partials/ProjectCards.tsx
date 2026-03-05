import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Link, router } from "@inertiajs/react";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { Row } from "@tanstack/react-table";
import { Plus, UsersRound, Calendar, FolderKanban, CheckCircle2 } from "lucide-react";

import { STATUS_CONFIG, type StatusType } from "@/utils/constants";

type ProjectCardsProps = {
  projects: Project[];
  permissions: { [key: number]: boolean };
  userId: number;
};

export default function ProjectCards({
  projects,
  permissions,
  userId,
}: ProjectCardsProps) {
  const calculateTaskProgress = (totalTasks: number, completedTasks: number) => {
    const total = Number(totalTasks ?? 0);
    const completed = Number(completedTasks ?? 0);

    if (total === 0) return 0;
    const percentage = (completed / total) * 100;
    return Math.round(percentage * 10) / 10;
  };

  return (
    <div
      className={`grid flex-1 gap-6 ${projects.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}
    >
      {projects.slice(0, 6).map((project) => {
        const StatusIcon =
          STATUS_CONFIG[project.status as StatusType]?.icon ||
          STATUS_CONFIG.default.icon;

        const tasksProgress = calculateTaskProgress(
          project.total_tasks,
          project.completed_tasks,
        );

        return (
          <div key={project.id} className="group relative min-w-0 rounded-2xl bg-card p-6 shadow-sm border border-primary/5 transition-all hover:shadow-md hover:bg-accent/5 overflow-hidden">
            {/* Background Decor */}
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 ${STATUS_CONFIG[project.status as StatusType]?.color || 'text-primary'}`}>
               <FolderKanban className="h-full w-full" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 ${STATUS_CONFIG[project.status as StatusType].color}`}>
                   <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={route("project.show", project.id)}
                    className="truncate text-lg font-black tracking-tight hover:text-primary transition-colors"
                    title={project.name}
                  >
                    {project.name}
                  </Link>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Dibuat {formatDate(project.created_at)}
                  </p>
                </div>
              </div>
              
              <DataTableRowActions
                row={{ original: project } as Row<Project>}
                onView={() => router.get(route("project.show", project.id))}
                onEdit={() => router.get(route("project.edit", project.id))}
                onDelete={() => router.delete(route("project.destroy", project.id))}
                onLeave={() => router.post(route("project.leave", { project: project.id }), { preserveScroll: true })}
                isProjectTable={true}
                isCreator={project.created_by === userId}
                canEdit={permissions[project.id]}
                customActions={[
                  {
                    icon: Plus,
                    label: "Buat Tugas",
                    onClick: (row) => router.get(route("task.create", { project_id: row.original.id })),
                  },
                  ...(permissions[project.id] ? [{
                    icon: UsersRound,
                    label: "Undang Tim",
                    onClick: (row: Row<Project>) => router.get(route("project.show", { project: row.original.id, tab: "invite" })),
                  }] : []),
                ]}
              />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                 <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Daftar Tugas</h4>
                 <Badge variant="outline" className="text-[10px] font-bold">{project.total_tasks} Total</Badge>
              </div>
              <ul className="space-y-1">
                {project.tasks.slice(0, 3).map((task) => {
                  const statusConfig = task.status?.slug
                    ? STATUS_CONFIG[task.status.slug as StatusType] || STATUS_CONFIG.default
                    : STATUS_CONFIG.default;
                  const TaskStatusIcon = statusConfig.icon;

                  return (
                    <li key={task.id} className="min-w-0">
                      <Link
                        className="group/item flex min-w-0 items-center gap-3 rounded-lg p-2 transition-all hover:bg-background"
                        href={route("task.show", task.id)}
                      >
                        <div className={`shrink-0 rounded-full p-1 ${statusConfig.color} bg-current/10`}>
                           <TaskStatusIcon className="h-3 w-3" />
                        </div>
                        <span className={`min-w-0 flex-1 truncate text-sm font-medium ${task.status?.slug === "completed" ? "line-through text-muted-foreground" : "text-foreground/80"}`}>
                          {task.name}
                        </span>
                        {task.labels?.[0] && (
                          <Badge variant={task.labels[0].variant} className="shrink-0 text-[9px] uppercase tracking-tighter px-1 py-0 h-4">
                            {task.labels[0].name}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
                {project.tasks.length > 3 && (
                  <li className="pl-9 text-[11px] font-bold italic text-muted-foreground/60">+ {project.tasks.length - 3} tugas lainnya...</li>
                )}
              </ul>
            </div>

            <div className="mt-6 space-y-2 pt-4 border-t border-primary/5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-primary">
                   <CheckCircle2 className="h-3 w-3" /> {tasksProgress}% Selesai
                </span>
                <span className="text-muted-foreground">
                  {project.completed_tasks ?? 0} / {project.total_tasks ?? 0} Tugas
                </span>
              </div>
              <Progress value={tasksProgress} className="h-1.5 shadow-inner" />
            </div>
          </div>
        );
      })}
    </div>
  );
}