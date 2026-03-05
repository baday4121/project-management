import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PaginatedUser, User } from "@/types/user";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { FilterableColumn, PaginationLinks, PaginationMeta } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { CirclePlus, Users, UserPlus, Mail } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

type IndexProps = {
  users: PaginatedUser & { meta: PaginationMeta; links: PaginationLinks };
  queryParams: { [key: string]: any } | null;
  success: string | null;
};

export default function Index({ users, queryParams, success }: IndexProps) {
  queryParams = queryParams || {};
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

  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        defaultHidden: true,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pengguna" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-primary/10">
              <AvatarImage src={row.original.profile_picture ? `/storage/${row.original.profile_picture}` : undefined} />
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                {row.original.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{row.original.name}</span>
              <span className="text-xs text-muted-foreground md:hidden">{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span>{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tanggal Bergabung" />
        ),
        cell: ({ row }) =>
          row.original.created_at ? formatDate(row.original.created_at) : "Tanpa tanggal",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            onEdit={(row) => router.get(route("user.edit", row.original.id))}
            onDelete={(row) => {
              router.delete(route("user.destroy", row.original.id));
            }}
          />
        ),
      },
    ],
    [],
  );

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "name",
      title: "Nama",
      filterType: "text",
    },
    {
      accessorKey: "email",
      title: "Email",
      filterType: "text",
    },
    {
      accessorKey: "created_at",
      title: "Tanggal",
      filterType: "date",
    },
  ];

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
            Manajemen Pengguna
          </h2>
        </div>
      }
    >
      <Head title="Pengguna" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Stats / Info */}
          <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl font-bold">Kelola Anggota Tim</CardTitle>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  Buat dan kelola akun pengguna, kontrol hak akses, dan pantau informasi anggota tim Workdei Anda dalam satu dasbor terpusat.
                </p>
              </div>
              <Link href={route("user.create")}>
                <Button className="w-full sm:w-auto shadow-md px-6">
                  <UserPlus className="h-5 w-5 mr-2" />
                  <span>Tambah Pengguna</span>
                </Button>
              </Link>
            </CardHeader>
          </Card>

          {/* Table Section */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-0 sm:p-6">
              <div className="p-4 sm:p-0 mb-4">
                <h3 className="text-lg font-bold">Daftar Pengguna Aktif</h3>
              </div>
              <DataTable
                columns={columns}
                entity={users}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="user.index"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}