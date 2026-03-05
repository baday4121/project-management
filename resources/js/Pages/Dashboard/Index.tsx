import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginatedTask } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CirclePlus, UsersRound, Layout, CheckSquare, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { StatsCards } from "./Partials/StatsCards";
import { ActiveTasksTable } from "./Partials/ActiveTasksTable";
import { QueryParams } from "@/types/utils";

type Props = {
  totalPendingTasks: number;
  myPendingTasks: number;
  totalProgressTasks: number;
  myProgressTasks: number;
  totalCompletedTasks: number;
  myCompletedTasks: number;
  activeTasks: PaginatedTask;
  success: string | null;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export default function Dashboard({
  totalPendingTasks,
  myPendingTasks,
  totalProgressTasks,
  myProgressTasks,
  totalCompletedTasks,
  myCompletedTasks,
  activeTasks,
  queryParams,
  labelOptions,
  permissions,
  success,
  statusOptions,
  projectOptions,
}: Props) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  const stats = [
    { slug: "pending", total: totalPendingTasks, mine: myPendingTasks },
    { slug: "in_progress", total: totalProgressTasks, mine: myProgressTasks },
    { slug: "completed", total: totalCompletedTasks, mine: myCompletedTasks },
  ];

  const defaultTab = "tasks";

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
            Panel Utama
          </h2>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Section */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <CardTitle className="text-2xl font-bold">Selamat Datang di Workdei!</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="mb-6 text-muted-foreground text-lg leading-relaxed">
                Kelola proyek dan tugas Anda dengan lebih efisien. Mulai dengan membuat 
                proyek baru, tugas, atau cek undangan proyek yang tertunda.
              </h4>
              <div className="flex flex-wrap gap-3">
                <Link href={route("project.create")}>
                  <Button className="shadow-md px-6">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    <span>Buat Proyek</span>
                  </Button>
                </Link>
                <Link href={route("task.create")}>
                  <Button variant="outline" className="shadow-sm px-6">
                    <CheckSquare className="mr-2 h-5 w-5 text-primary" />
                    <span>Buat Tugas</span>
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button variant="secondary" className="shadow-sm px-6">
                    <UsersRound className="mr-2 h-5 w-5" />
                    <span>Undangan</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href={route("project.index")} className="group">
              <Card className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md border-none bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg font-bold">Ringkasan Proyek</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lihat dan kelola semua proyek aktif Anda
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href={route("task.index")} className="group">
              <Card className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md border-none bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <CheckSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg font-bold">Ringkasan Tugas</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pantau progres tugas di seluruh proyek
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Main Content Tabs */}
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-muted/50 p-1">
                  <TabsTrigger value="tasks" className="text-md">Tugas Aktif</TabsTrigger>
                  <TabsTrigger value="stats" className="text-md">Statistik</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="mt-4 focus-visible:outline-none animate-in fade-in duration-500">
                  <ActiveTasksTable
                    activeTasks={activeTasks}
                    queryParams={queryParams}
                    labelOptions={labelOptions}
                    permissions={permissions}
                    projectOptions={projectOptions}
                    statusOptions={statusOptions}
                  />
                </TabsContent>

                <TabsContent value="stats" className="mt-4 focus-visible:outline-none animate-in fade-in duration-500">
                  <div className="py-4">
                    <StatsCards stats={stats} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}