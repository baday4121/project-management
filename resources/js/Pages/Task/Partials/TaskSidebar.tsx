import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDate } from "@/utils/helpers";
import { Task } from "@/types/task";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { UserPlus, UserMinus, Calendar, Tag, Info, User as UserIcon } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

type TaskSidebarProps = {
  task: Task;
};

export function TaskSidebar({ task }: TaskSidebarProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleAssign = () => {
    showConfirmation({
      title: "Ambil Tugas",
      description: "Apakah Anda yakin ingin mengerjakan tugas ini?",
      action: () => router.post(route("task.assignToMe", task.id)),
      actionText: "Ambil",
    });
  };

  const handleUnassign = () => {
    showConfirmation({
      title: "Lepas Tugas",
      description: "Apakah Anda yakin ingin berhenti mengerjakan tugas ini?",
      action: () => router.post(route("task.unassign", task.id)),
      actionText: "Lepaskan",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/20 p-5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" /> Detail Tugas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-5 divide-y divide-primary/5">
          
          {/* Section: Penanggung Jawab */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <UserIcon className="h-3 w-3" /> Penanggung Jawab
            </h4>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/10">
                  <AvatarImage src={task.assignedUser?.profile_picture} />
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {task.assignedUser?.name.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold truncate max-w-[120px]">
                    {task.assignedUser?.name || "Belum ada"}
                  </span>
                  {!task.assignedUser && <span className="text-[10px] text-muted-foreground italic">Klik ambil untuk mengerjakan</span>}
                </div>
              </div>
              
              <div className="shrink-0">
                {task.can.assign && (
                  <Button
                    size="sm"
                    onClick={handleAssign}
                    className="h-8 font-bold shadow-sm shadow-primary/20"
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Ambil
                  </Button>
                )}
                {task.can.unassign && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleUnassign}
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
                  >
                    <UserMinus className="h-3.5 w-3.5 mr-1.5" /> Lepas
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Section: Label */}
          {task.labels && task.labels.length > 0 && (
            <div className="pt-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Tag className="h-3 w-3" /> Label
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <Badge key={label.id} variant={label.variant} className="text-[10px] font-black uppercase tracking-tighter shadow-sm">
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Section: Tenggat Waktu */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Tenggat Waktu
            </h4>
            <p className={`text-sm font-bold ${task.due_date ? 'text-foreground' : 'text-muted-foreground italic'}`}>
              {task.due_date ? formatDate(task.due_date) : "Tidak ada tenggat"}
            </p>
          </div>

          {/* Section: Histori Pembuatan */}
          <div className="pt-5 space-y-4">
             <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dibuat Oleh</h4>
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-primary/5">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={task.createdBy.profile_picture} />
                    <AvatarFallback>{task.createdBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold truncate">{task.createdBy.name}</span>
                    <span className="text-[9px] text-muted-foreground">{formatDate(task.created_at)}</span>
                  </div>
                </div>
             </div>

             <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pembaruan Terakhir</h4>
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-primary/5">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={task.updatedBy.profile_picture} />
                    <AvatarFallback>{task.updatedBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold truncate">{task.updatedBy.name}</span>
                    <span className="text-[9px] text-muted-foreground">{formatDate(task.updated_at)}</span>
                  </div>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog />
    </div>
  );
}