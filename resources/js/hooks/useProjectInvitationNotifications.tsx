import { useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";
import { ProjectInvitationEvent } from "@/types/project";
import { ToastAction } from "@/Components/ui/toast";

export function useProjectInvitationNotifications() {
  const user = usePage<PageProps>().props.auth.user;
  const { toast, dismiss } = useToast();

  useEffect(() => {
    const channel = window.Echo.private(`management.${user.id}`);

    channel.listen(
      "ProjectInvitationRequestReceived",
      (event: ProjectInvitationEvent) => {
        const toaster = toast({
          title: "Undangan Proyek Baru",
          description: `Anda telah diundang untuk bergabung dalam proyek ${event.project.name}`,
          variant: "default",
          action: (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="font-bold"
                onClick={() => {
                  router.post(
                    route("project.acceptInvitation", event.project.id),
                    { preserveScroll: true },
                    {
                      onSuccess: () => {
                        toast({
                          title: "Undangan Diterima",
                          description: `Anda berhasil bergabung di proyek ${event.project.name}`,
                          variant: "success",
                          action: (
                            <ToastAction altText="Lihat Proyek">
                              <Link
                                href={route("project.show", event.project.id)}
                                className="font-bold"
                              >
                                Lihat Proyek
                              </Link>
                            </ToastAction>
                          ),
                        });
                      },
                    },
                  );
                  dismiss(toaster.id);
                }}
              >
                Terima
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="font-bold"
                onClick={() => {
                  router.post(
                    route("project.rejectInvitation", event.project.id),
                    { preserveScroll: true },
                    {
                      onSuccess: () => {
                        toast({
                          title: "Undangan Ditolak",
                          description: `Anda telah menolak undangan untuk proyek ${event.project.name}`,
                          variant: "destructive",
                        });
                      },
                    },
                  );
                  dismiss(toaster.id);
                }}
              >
                Tolak
              </Button>
            </div>
          ),
        });
      },
    );

    return () => {
      channel.stopListening("ProjectInvitationRequestReceived");
    };
  }, [user.id]);
}