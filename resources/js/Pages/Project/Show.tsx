import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ProjectInfo from "./Partials/ProjectInfo";
import InviteUsers from "./Partials/InviteUsers";
import ProjectTasks from "./Partials/ProjectTasks";
import { Project } from "@/types/project";
import { PaginatedTask } from "@/types/task";
import { QueryParams } from "@/types/utils";
import { toast } from "@/hooks/use-toast";
import { FolderKanban, Info, UserPlus, ListTodo, ChevronLeft, ImageIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";

type Props = {
  project: Project;
  tasks: PaginatedTask;
  error: string | null;
  success: string | null;
  queryParams: QueryParams;
  activeTab: string;
  labelOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canInviteUsers: boolean;
    canEditProject: boolean;
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
};

export default function Show({
  project,
  tasks,
  success,
  queryParams,
  error: serverError,
  activeTab: initialActiveTab,
  permissions,
  labelOptions,
  statusOptions,
}: Props) {
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
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const tab = url.searchParams.get("tab") || "tasks";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  const handleInviteClick = () => {
    handleTabChange("invite");
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Link href={route("project.index")}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <FolderKanban className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-100">
                {project.name}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tombol Akses Galeri Aset - Desain Baru */}
            <Link href={route("project.assets", project.id)}>
              <Button variant="outline" className="h-9 gap-2 rounded-xl border-primary/20 bg-background font-bold text-primary hover:bg-primary/5 shadow-sm">
                <ImageIcon className="h-4 w-4" />
                Galeri Aset
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Proyek Aktif
            </div>
          </div>
        </div>
      }
    >
      <Head title={`Proyek: ${project.name}`} />

      <div className="py-8">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
            <div className="flex justify-center sm:justify-start overflow-x-auto pb-2 sm:pb-0">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 p-1 text-muted-foreground shadow-inner border border-primary/5">
                <TabsTrigger 
                  value="tasks" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <ListTodo className="h-4 w-4" />
                  Daftar Tugas
                </TabsTrigger>
                <TabsTrigger 
                  value="info"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Info className="h-4 w-4" />
                  Informasi
                </TabsTrigger>
                {permissions.canInviteUsers && (
                  <TabsTrigger 
                    value="invite"
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Undang Tim
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <TabsContent value="tasks" className="focus-visible:outline-none">
                <ProjectTasks
                  tasks={tasks}
                  queryParams={queryParams}
                  projectId={project.id}
                  permissions={permissions}
                  labelOptions={labelOptions}
                  statusOptions={statusOptions}
                />
              </TabsContent>
              
              <TabsContent value="info" className="focus-visible:outline-none">
                <ProjectInfo
                  project={project}
                  onInviteClick={handleInviteClick}
                  permissions={permissions}
                />
              </TabsContent>
              
              <TabsContent value="invite" className="focus-visible:outline-none">
                <InviteUsers project={project} serverError={serverError} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}