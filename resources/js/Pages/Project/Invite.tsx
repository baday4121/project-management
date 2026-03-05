import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import {
  INVITATION_STATUS_BADGE_MAP,
  INVITATION_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import { PaginatedProject, Project } from "@/types/project";
import { FilterableColumn } from "@/types/utils";
import { useEffect } from "react";
import { formatDate } from "@/utils/helpers";
import { Check, X, MailOpen } from "lucide-react";

type PageProps = {
  invitations: PaginatedProject;
  success: string | null;
  queryParams: { [key: string]: any } | null;
};

const handleAccept = (projectId: number) => {
  router.post(route("project.acceptInvitation", projectId), {
    preserveScroll: true,
  });
};

const handleReject = (projectId: number) => {
  router.post(route("project.rejectInvitation", projectId), {
    preserveScroll: true,
  });
};

const columns: ColumnDef<Project, any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Proyek" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorFn: (row) => row.pivot?.status,
    id: "pivot.status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.pivot?.status;
      return (
        <Badge
          variant={
            INVITATION_STATUS_BADGE_MAP[
              status as keyof typeof INVITATION_STATUS_BADGE_MAP
            ]
          }
          className="capitalize"
        >
          {
            INVITATION_STATUS_TEXT_MAP[
              status as keyof typeof INVITATION_STATUS_TEXT_MAP
            ]
          }
        </Badge>
      );
    },
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
    cell: ({ row }) =>
      row.original.pivot?.status === "pending" && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 shadow-sm"
            onClick={() => handleAccept(row.original.id)}
          >
            <Check className="mr-1.5 h-4 w-4" />
            Terima
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="shadow-sm"
            onClick={() => handleReject(row.original.id)}
          >
            <X className="mr-1.5 h-4 w-4" />
            Tolak
          </Button>
        </div>
      ),
  },
];

const filterableColumns: FilterableColumn[] = [
  {
    accessorKey: "name",
    title: "Nama Proyek",
    filterType: "text",
  },
  {
    accessorKey: "pivot.status",
    title: "Status",
    filterType: "select",
    options: Object.entries(INVITATION_STATUS_TEXT_MAP).map(([value, label]) => ({
      value,
      label,
    })),
  },
];

export default function Invite({ invitations, success, queryParams }: PageProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        description: success,
        variant: "success",
      });
    }
  }, [success]);

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center gap-2">
          <MailOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
            Undangan Proyek
          </h2>
        </div>
      }
    >
      <Head title="Undangan Proyek" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 space-y-1">
            <h3 className="text-lg font-semibold">Daftar Undangan</h3>
            <p className="text-sm text-muted-foreground">
              Kelola undangan kolaborasi proyek yang dikirimkan kepada Anda.
            </p>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden">
            <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
              <DataTable
                columns={columns}
                entity={invitations}
                filterableColumns={filterableColumns}
                queryParams={queryParams || {}}
                routeName="project.invitations"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}