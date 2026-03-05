import { Link, router } from "@inertiajs/react";
import { PaginatedTask, Task } from "@/types/task";
import { Badge } from "@/Components/ui/badge";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { useMemo } from "react";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { formatDate } from "@/utils/helpers";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
} from "@/utils/constants";
import { useTruncate } from "@/hooks/use-truncate";
import { Calendar, Layers } from "lucide-react";

type ActiveTasksTableProps = {
  activeTasks: PaginatedTask;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export function ActiveTasksTable({
  activeTasks,
  queryParams,
  labelOptions,
  permissions,
  projectOptions,
  statusOptions,
}: ActiveTasksTableProps) {
  queryParams = queryParams || {};

  const columns = useMemo<ColumnDef<Task, any>[]>(
    () => [
      {
        accessorKey: "id",
        defaultHidden: true,
        hideFromViewOptions: true,
      },
      {
        accessorKey: "project_id",
        defaultHidden: true,
        hideFromViewOptions: true,
      },
      {
        accessorKey: "task_number",
        header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
        cell: ({ row }) => <span className="font-mono text-muted-foreground">#{row.original.task_number}</span>,
      },
      {
        accessorKey: "project.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Proyek" />
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <Link 
            href={route("project.show", row.original.project.id)}
            className="flex items-center gap-2 font-medium text-primary hover:underline"
          >
            <Layers className="h-3.5 w-3.5" />
            {row.original.project.name}
          </Link>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nama Tugas" />
        ),
        cell: ({ row }) => (
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
                  <Badge key={label.id} variant={label.variant} className="text-[10px] px-1.5 py-0">
                    {truncatedName}
                  </Badge>
                );
              })}
            </div>
          </div>
        ),
        minWidth: 250,
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Prioritas" />
        ),
        cell: ({ row }) => (
          <Badge variant={TASK_PRIORITY_BADGE_MAP[row.original.priority]} className="font-bold">
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
            className="shadow-sm"
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
          <div className="flex items-center gap-2 text-muted-foreground">
             <Calendar className="h-3.5 w-3.5" />
             <span className="text-sm">
                {row.original.due_date ? formatDate(row.original.due_date) : "Tanpa Tanggal"}
             </span>
          </div>
        )
      },
      {
        accessorKey: "updated_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pembaruan Terakhir" />
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
    ],
    [permissions],
  );

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "project_id",
      title: "Proyek",
      filterType: "select",
      options: projectOptions,
    },
    {
      accessorKey: "name",
      title: "Nama",
      filterType: "text",
    },
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
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-medium text-muted-foreground">
          Daftar tugas aktif yang saat ini ditugaskan kepada Anda.
        </p>
      </div>
      
      <div className="rounded-xl border bg-card/50 overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          entity={activeTasks}
          filterableColumns={filterableColumns}
          queryParams={queryParams}
          routeName="dashboard"
        />
      </div>
    </div>
  );
}