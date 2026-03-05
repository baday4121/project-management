import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginatedTask } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CirclePlus, UsersRound, Layout, CheckSquare, Sparkles, ArrowRight } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-100">
            Dashboard
          </h2>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
             <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             Sistem Aktif
          </div>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          
          {/* Hero Welcome Section */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 shadow-2xl dark:bg-primary/10">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground md:text-primary">
                  <Sparkles className="h-3 w-3" />
                  Update Terbaru
                </div>
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                  Halo, selamat datang di <span className="text-primary">WorkDei!</span>
                </h1>
                <p className="max-w-xl text-lg text-slate-300">
                  Pantau semua aktivitas proyek dan tugas tim Anda dalam satu tampilan cerdas. Apa yang ingin Anda kerjakan hari ini?
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={route("project.create")}>
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    Buat Proyek
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8 font-bold">
                    <UsersRound className="mr-2 h-5 w-5" />
                    Undangan
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link href={route("project.index")} className="group">
              <Card className="relative overflow-hidden border-none shadow-sm transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <Layout className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Proyek</CardTitle>
                      <p className="text-sm text-muted-foreground">Kelola struktur kerja tim</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </CardHeader>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
              </Card>
            </Link>

            <Link href={route("task.index")} className="group">
              <Card className="relative overflow-hidden border-none shadow-sm transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      <CheckSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Tugas</CardTitle>
                      <p className="text-sm text-muted-foreground">Pantau progres harian</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </CardHeader>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 transition-all duration-500 group-hover:w-full" />
              </Card>
            </Link>
          </div>

          {/* Main Dashboard Tabs */}
          <div className="space-y-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <TabsList className="h-12 bg-muted/50 p-1">
                  <TabsTrigger value="tasks" className="px-8 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Daftar Tugas Aktif
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="px-8 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Statistik Performa
                  </TabsTrigger>
                </TabsList>
                
                <Link href={route("task.create")} className="hidden sm:block">
                  <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Tugas Cepat
                  </Button>
                </Link>
              </div>

              <TabsContent value="tasks" className="mt-0 ring-offset-background focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <CardContent className="p-0">
                    <ActiveTasksTable
                      activeTasks={activeTasks}
                      queryParams={queryParams}
                      labelOptions={labelOptions}
                      permissions={permissions}
                      projectOptions={projectOptions}
                      statusOptions={statusOptions}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                <StatsCards stats={stats} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}