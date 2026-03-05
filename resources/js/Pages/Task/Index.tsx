import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PaginatedTask, Task } from "@/types/task";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import {
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_PRIORITY_BADGE_MAP,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { CirclePlus, Layout } from "lucide-react";
import { useTruncate } from "@/hooks/use-truncate";

type IndexProps = {
  tasks: PaginatedTask;
  success: string | null;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
  statusOptions: { value: string; label: string }[];
};

export default function Index({
  tasks,
  queryParams,
  success,
  labelOptions,
  permissions,
  projectOptions,
  statusOptions,
}: IndexProps) {
  queryParams = queryParams || {};

  const { toast } = useToast();
  const { url } = usePage();
  const isMyTasksPage = url.endsWith("/tasks/my-tasks");

  const pageContent = {
    title: isMyTasksPage ? "Tugas Saya" : "Daftar Tugas",
    cardTitle: isMyTasksPage
      ? "Manajemen Tugas Pribadi"
      : "Kelola Tugas Anda dengan Efektif",
    description: isMyTasksPage
      ? "Lihat dan kelola tugas yang ditugaskan khusus untuk Anda di semua proyek. Pantau beban kerja dan progres pribadi Anda."
      : "Atur tugas Anda, tetapkan prioritas, dan pantau progres. Gunakan alat yang tersedia untuk membuat, melihat, dan memperbarui tugas secara efisien.",
  };

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

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
        header: ({ column }) => <DataTableColumnHeader column={column} title="No" />,
        cell: ({ row }) => `#${row.original.task_number}`,
      },
      {
        accessorKey: "project.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Proyek" />
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <Link href={route("project.show", row.original.project.id)} className="hover:underline text-primary font-medium">
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
          <Link
            className="group flex flex-col items-start gap-1.5 md:flex-row md:items-center md:justify-between"
            href={route("task.show", row.original.id)}
          >
            <span className="font-medium group-hover:text-primary transition-colors">{row.original.name}</span>
            <div className="flex items-center gap-2">
              {row.original.labels?.slice(0, 2).map((label) => {
                const truncatedName = useTruncate(label.name);
                return (
                  <Badge key={label.id} variant={label.variant}>
                    {truncatedName}
                  </Badge>
                );
              })}
            </div>
          </Link>
        ),
        minWidth: 200,
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Prioritas" />
        ),
        cell: ({ row }) => (
          <Badge variant={TASK_PRIORITY_BADGE_MAP[row.original.priority]}>
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
          >
            {row.original.status.name}
          </Badge>
        ),
      },
      {
        accessorKey: "due_date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tenggat Waktu" />
        ),
        cell: ({ row }) =>
          row.original.due_date ? formatDate(row.original.due_date) : "Tanpa tanggal",
        defaultHidden: true,
      },
      {
        accessorKey: "assignedUser.name",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ditugaskan Ke" />
        ),
        cell: ({ row }) => row.original.assignedUser?.name ?? "Belum ditugaskan",
      },
      {
        accessorKey: "updated_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Terakhir Diperbarui" />
        ),
        cell: ({ row }) => formatDate(row.original.updated_at),
        defaultHidden: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            onView={(row) => {
              const taskId = row.original.id;
              router.get(route("task.show", taskId));
            }}
            onEdit={(row) => {
              const taskId = row.original.id;
              router.get(route("task.edit", taskId));
            }}
            onDelete={(row) => {
              const taskId = row.original.id;
              router.get(route("task.destroy", taskId));
            }}
            onAssign={(row) => {
              router.post(route("task.assignToMe", row.original.id));
            }}
            onUnassign={(row) => {
              router.post(route("task.unassign", row.original.id));
            }}
            canEdit={permissions.canManageTasks}
          />
        ),
      },
      {
        accessorKey: "label_ids",
        defaultHidden: true,
        hideFromViewOptions: true,
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
    {
      accessorKey: "created_by_name",
      title: "Dibuat Oleh",
      filterType: "text",
    },
  ];

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {pageContent.title}
          </h2>
        </div>
      }
    >
      <Head title={pageContent.title} />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader>
              <CardTitle>{pageContent.cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="leading-relaxed text-muted-foreground">{pageContent.description}</h4>
              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("task.create")}>
                  <Button className="w-full shadow sm:w-auto px-6">
                    <CirclePlus className="h-5 w-5 mr-2" />
                    <span>Buat Tugas</span>
                  </Button>
                </Link>
                <Link href={route("project.index")}>
                  <Button variant="secondary" className="w-full shadow sm:w-auto px-6">
                    <Layout className="h-5 w-5 mr-2" />
                    <span>Lihat Proyek</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
              <DataTable
                columns={columns}
                entity={tasks}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="task.index"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}