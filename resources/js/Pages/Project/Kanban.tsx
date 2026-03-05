import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Project } from "@/types/project";
import { KanbanBoard } from "./Partials/KanbanBoard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { KanbanColumn } from "@/types/kanban";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Settings, Info, CirclePlus, LayoutGrid } from "lucide-react";
import { ReorderColumnsDialog } from "./Partials/ReorderColumnsDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type Props = {
  project: Project;
  columns: KanbanColumn[];
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  success?: string | null;
  error?: string | null;
};

export default function Kanban({
  project,
  columns,
  permissions,
  success,
  error,
}: Props) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        description: success,
        variant: "success",
      });
    }
    if (error) {
      toast({
        title: "Gagal",
        description: error,
        variant: "destructive",
      });
    }
  }, [success, error]);

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
            Papan Kanban - {project.name}
          </h2>
        </div>
      }
    >
      <Head title={`${project.name} - Papan Kanban`} />

      <div className="py-8">
        <div className="space-y-8">
          {/* Header Info Section */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader className="pb-4">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black italic tracking-tighter text-primary">Workdei Kanban</CardTitle>
                    <CardDescription className="text-base font-medium">
                      Proyek:{" "}
                      <Link
                        className="text-foreground hover:text-primary hover:underline transition-colors"
                        href={route("project.show", project.id)}
                      >
                        {project.name}
                      </Link>
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {permissions.canManageTasks && (
                      <Link href={route("task.create", { project_id: project.id })}>
                        <Button className="w-full font-bold shadow-lg shadow-primary/20 md:w-auto">
                          <CirclePlus className="h-4 w-4 mr-2" />
                          Tambah Tugas
                        </Button>
                      </Link>
                    )}
                    <Link href={route("project.show", project.id)}>
                      <Button variant="outline" className="w-full font-semibold md:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Accordion
                  type="single"
                  collapsible
                  className="rounded-xl border bg-background/50 px-4 transition-all"
                >
                  <AccordionItem value="about" className="border-none">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Info className="h-4 w-4" />
                        Petunjuk Penggunaan Papan
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-inside list-disc text-sm text-muted-foreground leading-relaxed">
                        <li>Geser dan lepas (drag & drop) kartu untuk mengubah status tugas</li>
                        <li>Klik pada kartu tugas untuk melihat detail lebih lengkap</li>
                        <li>Tambahkan tugas baru langsung ke kolom yang diinginkan</li>
                        {permissions.canManageBoard && (
                          <>
                            <li>Kelola urutan kolom untuk menyesuaikan alur kerja tim</li>
                            <li>Kustomisasi status tugas melalui menu pengaturan</li>
                          </>
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {permissions.canManageBoard && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-primary/5">
                    <Link href={route("project.statuses.index", project.id)} className="w-full md:w-auto">
                      <Button variant="secondary" size="sm" className="w-full gap-2 font-bold">
                        <Settings className="h-4 w-4" />
                        Pengaturan Status
                      </Button>
                    </Link>
                    <div className="w-full md:w-auto">
                      <ReorderColumnsDialog
                        columns={columns}
                        projectId={project.id}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kanban Board Area */}
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl bg-slate-900/5 dark:bg-slate-100/5 p-4 md:p-6 shadow-inner">
               {/* Efek Glow di belakang board */}
               <div className="absolute -z-10 top-0 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
               
               <KanbanBoard
                columns={columns}
                projectId={project.id}
                permissions={permissions}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}