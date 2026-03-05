import { PaginatedProject, Project } from "@/types/project";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/helpers";
import { CirclePlus, UsersRound, FolderPlus, LayoutGrid, List } from "lucide-react";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { FilterableColumn } from "@/types/utils";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PageProps } from "@/types";
import ProjectCards from "./Partials/ProjectCards";
import ProjectStats from "./Partials/ProjectStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

type IndexProps = {
  projects: PaginatedProject & {
    permissions: {
      [key: number]: boolean;
    };
  };
  allProjects: Project[];
  queryParams: { [key: string]: any } | null;
  success: string | null;
  activeTab: string;
};

const filterableColumns: FilterableColumn[] = [
  {
    accessorKey: "name",
    title: "Nama Proyek",
    filterType: "text",
  },
  {
    accessorKey: "status",
    title: "Status",
    filterType: "select",
    options: Object.entries(PROJECT_STATUS_TEXT_MAP).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "created_at",
    title: "Tanggal Dibuat",
    filterType: "date",
  },
];

export default function Index({ projects, queryParams, success }: IndexProps) {
  const { toast } = useToast();
  const {
    allProjects,
    auth: { user },
    activeTab: initialActiveTab = "overview",
  } = usePage<PageProps & IndexProps>().props;
  queryParams = queryParams || {};

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const updateUrlWithoutRefresh = (newTab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.pushState({ tab: newTab }, "", url.toString());
  };

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      updateUrlWithoutRefresh(newTab);
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const url = new URL(window.location.href);
      const tab = url.searchParams.get("tab") || "overview";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const columns: ColumnDef<Project, any>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
      cell: ({ row }) => (
        <Link href={route("project.show", row.original.id)} className="font-medium hover:underline text-primary">
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={PROJECT_STATUS_BADGE_MAP(row.original.status)}>
          {PROJECT_STATUS_TEXT_MAP[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tanggal Dibuat" />
      ),
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tenggat Waktu" />
      ),
      cell: ({ row }) =>
        row.original.due_date ? formatDate(row.original.due_date) : "Tanpa tenggat",
    },
    {
      accessorKey: "createdBy.name",
      header: () => "Pemilik",
      cell: ({ row }) => row.original.createdBy.name,
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
          onView={() => router.get(route("project.show", row.original.id))}
          onEdit={() => router.get(route("project.edit", row.original.id))}
          onDelete={() => router.delete(route("project.destroy", row.original.id))}
          onLeave={() => {
            router.post(route("project.leave", { project: row.original.id }), {
              preserveScroll: true,
            });
          }}
          isProjectTable={true}
          isCreator={row.original.createdBy.id === user.id}
          canEdit={projects.permissions[row.original.id]}
        />
      ),
    },
  ];

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
            Daftar Proyek
          </h2>
        </div>
      }
    >
      <Head title="Proyek Saya" />

      <main className="mx-auto max-w-7xl space-y-8 py-10">
        {/* Header Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-sm bg-gradient-to-r from-primary/5 via-transparent to-transparent">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Kelola Proyek Anda</CardTitle>
                <p className="text-muted-foreground max-w-2xl text-lg">
                  Pantau progres, kelola tugas, dan berkolaborasi dengan tim Anda dalam satu tempat yang efisien.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={route("project.create")}>
                  <Button className="w-full shadow-md sm:w-auto px-6 h-11 text-lg">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    <span>Buat Proyek</span>
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button variant="outline" className="w-full shadow-sm sm:w-auto px-6 h-11 text-lg">
                    <UsersRound className="mr-2 h-5 w-5 text-primary" />
                    <span>Undangan</span>
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </section>

        {allProjects.length > 0 ? (
          <section className="px-4 sm:px-6 lg:px-8">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-[300px] grid-cols-2 p-1 bg-muted/50">
                  <TabsTrigger value="overview" className="flex items-center gap-2 text-md">
                    <LayoutGrid className="h-4 w-4" /> Ringkasan
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2 text-md">
                    <List className="h-4 w-4" /> Tabel
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <ProjectCards
                    projects={allProjects}
                    permissions={projects.permissions}
                    userId={user.id}
                  />
                  <div className="pt-4">
                    <ProjectStats projects={allProjects} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0 focus-visible:outline-none">
                <Card className="overflow-hidden border-none shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold tracking-tight">Semua Proyek</h3>
                    </div>
                    <DataTable
                      columns={columns}
                      entity={projects}
                      filterableColumns={filterableColumns}
                      queryParams={queryParams}
                      routeName="project.index"
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        ) : (
          /* Empty State */
          <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderPlus className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Belum Ada Proyek</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Mulai perjalanan produktivitas Anda dengan membuat proyek pertama. 
                  Kelola tugas dan tim Anda dengan lebih terstruktur.
                </p>
              </div>
              <Link href={route("project.create")}>
                <Button size="lg" className="px-10 h-12 text-lg">
                  <CirclePlus className="mr-2 h-6 w-6" />
                  Buat Proyek Pertama
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </AuthenticatedLayout>
  );
}