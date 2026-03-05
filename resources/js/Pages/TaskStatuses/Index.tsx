import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Project } from "@/types/project";
import { PaginatedTaskStatus } from "@/types/task";
import { QueryParams } from "@/types/utils";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, CirclePlus, Info } from "lucide-react";
import StatusesList from "./Partials/StatusesList";

type Props = {
  project: Pick<Project, "id" | "name">;
  statuses: PaginatedTaskStatus;
  success: string | null;
  error: string | null;
  queryParams: QueryParams;
};

export default function Index({
  project,
  statuses,
  success,
  error,
  queryParams,
}: Props) {
  queryParams = queryParams || {};

  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Berhasil",
        variant: "success",
        description: success,
      });
    }
    if (error) {
      toast({
        title: "Kesalahan",
        variant: "destructive",
        description: error,
      });
    }
  }, [success, error]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Status Tugas untuk Proyek "{project.name}"
        </h2>
      }
    >
      <Head title={`Status - ${project.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-2">
                <div>
                  <CardTitle className="text-2xl font-bold">Status Proyek</CardTitle>
                  <CardDescription className="mt-1.5 text-base">
                    Proyek:{" "}
                    <Link
                      className="font-medium text-primary hover:underline"
                      href={route("project.show", project.id)}
                    >
                      {project.name}
                    </Link>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-3 md:flex-row">
                  <Link href={route("project.statuses.create", project.id)}>
                    <Button className="w-full shadow-md md:w-auto px-6">
                      <CirclePlus className="h-4 w-4 mr-2" />
                      Tambah Status
                    </Button>
                  </Link>
                  <Link href={route("project.show", project.id)}>
                    <Button variant="outline" className="w-full shadow-sm md:w-auto">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Kembali ke Proyek
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-secondary/50 p-5 dark:bg-secondary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-lg">Tentang Status Tugas</h4>
                </div>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <li>
                    Status tugas membantu memantau progres setiap pekerjaan dalam proyek Anda.
                  </li>
                  <li>Manajer proyek dapat membuat dan mengelola status kustom sesuai alur kerja.</li>
                  <li>Status bawaan (*default*) tersedia secara otomatis di semua proyek.</li>
                  <li>Status bawaan tidak dapat diubah atau dihapus untuk menjaga konsistensi sistem.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <StatusesList
              statuses={statuses}
              projectId={project.id}
              queryParams={queryParams}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}