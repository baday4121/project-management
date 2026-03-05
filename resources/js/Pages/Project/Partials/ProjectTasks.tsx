import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { Badge } from "@/Components/ui/badge";
import { formatDate } from "@/utils/helpers";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
} from "@/utils/constants";
import { PaginatedTask, Task } from "@/types/task";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { CirclePlus, LayoutDashboard, Tag, Calendar, User } from "lucide-react";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { useTruncate } from "@/hooks/use-truncate";

type Props = {
  tasks: PaginatedTask;
  queryParams: QueryParams;
  projectId: number;
  labelOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export default function ProjectTasks({
  tasks,
  queryParams,
  projectId,
  permissions,
  labelOptions,
  statusOptions,
}: Props) {
  queryParams = queryParams || {};

  const columns: ColumnDef<Task, any>[] = [
    {
      accessorKey: "id",
      defaultHidden: true,
      hideFromViewOptions: true,
    },
    {
      accessorKey: "task_number",
      header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{row.original.task_number}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Tugas" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1.5 py-1">
            <Link
              className="font-bold text-foreground hover:text-primary transition-colors tracking-tight"
              href={route("task.show", row.original.id)}
            >
              {row.original.name}
            </Link>
            <div className="flex flex-wrap gap-1">
              {row.original.labels?.slice(0, 3).map((label) => {
                const truncatedName = useTruncate(label.name);
                return (
                  <Badge 
                    key={label.id} 
                    variant={label.variant} 
                    className="text-[10px] px-1.5 py-0 uppercase tracking-tighter"
                  >
                    {truncatedName}
                  </Badge>
                );
              })}
            </div>
          </div>
        );
      },
      minWidth: 250,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prioritas" />
      ),
      cell: ({ row }) => (
        <Badge variant={TASK_PRIORITY_BADGE_MAP[row.original.priority]} className="font-bold shadow-sm">
          {TASK_PRIORITY_TEXT_MAP[row.original.priority]}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={TASK_STATUS_BADGE_MAP(
            row.original.status.slug,
            row.original.status.color,
          )}
          className="border-none"
        >
          {row.original.status.name}
        </Badge>
      ),
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tenggat" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {row.original.due_date ? formatDate(row.original.due_date) : "-"}
        </div>
      ),
    },
    {
      accessorKey: "assignedUser.name",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ditugaskan" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <User className="h-3.5 w-3.5 text-primary/60" />
          {row.original.assignedUser?.name ?? <span className="text-muted-foreground/50">Belum ada</span>}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pembaruan" />
      ),
      cell: ({ row }) => formatDate(row.original.updated_at),
      defaultHidden: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={(row) => router.get(route("task.show", row.original.id))}
          onEdit={(row) => router.get(route("task.edit", row.original.id))}
          onDelete={(row) => router.delete(route("task.destroy", row.original.id))}
          onAssign={(row) => router.post(route("task.assignToMe", row.original.id))}
          onUnassign={(row) => router.post(route("task.unassign", row.original.id))}
          canEdit={permissions.canManageTasks}
        />
      ),
    },
  ];

  const filterableColumns: FilterableColumn[] = [
    { accessorKey: "name", title: "Nama Tugas", filterType: "text" },
    {
      accessorKey: "label_ids",
      title: "Label",
      filterType: "select",
      options: labelOptions,
    },
    {
      accessorKey: "priority",
      title: "Prioritas",
      filterType: "select",
      options: Object.entries(TASK_PRIORITY_TEXT_MAP).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      accessorKey: "status",
      title: "Status",
      filterType: "select",
      options: statusOptions,
    },
    {
      accessorKey: "due_date",
      title: "Tenggat Waktu",
      filterType: "date",
    },
  ];

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
      <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Daftar Tugas Proyek
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Kelola dan pantau semua tugas dalam proyek ini secara terpadu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {permissions.canManageTasks && (
            <Link href={route("task.create", { project_id: projectId })}>
              <Button className="w-full font-bold shadow-lg shadow-primary/20 sm:w-auto">
                <CirclePlus className="mr-2 h-4 w-4" />
                Tambah Tugas
              </Button>
            </Link>
          )}
          <Link href={route("kanban.show", { project: projectId })}>
            <Button variant="outline" className="w-full font-semibold sm:w-auto">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Papan Kanban
            </Button>
          </Link>
          {permissions.canManageTasks && (
            <Link href={route("project.labels.index", projectId)}>
              <Button variant="ghost" className="w-full font-semibold sm:w-auto hover:bg-primary/5">
                <Tag className="mr-2 h-4 w-4" />
                Kelola Label
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <DataTable
          columns={columns}
          entity={tasks}
          filterableColumns={filterableColumns}
          queryParams={queryParams}
          routeName="project.show"
          entityId={projectId}
        />
      </div>
    </div>
  );
}