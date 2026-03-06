import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
  ROLE_TEXT_MAP,
} from "@/utils/constants";
import { Button } from "@/Components/ui/button";
import {
  CircleX,
  LogOut,
  Pencil,
  UsersRound,
  UserMinus,
  Tag,
  UserCog,
  LayoutDashboard,
  Settings,
  Calendar,
  User as UserIcon,
  Info,
  ShieldAlert,
  Fingerprint,
  Files,
  ArrowRight
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

type Props = {
  project: Project;
  onInviteClick: () => void;
  permissions: {
    canInviteUsers: boolean;
    canEditProject: boolean;
  };
};

export default function ProjectInfo({ project, onInviteClick, permissions }: Props) {
  const authUser = usePage<PageProps>().props.auth.user;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isKickDialogOpen, setKickDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isManageUsersDialogOpen, setManageUsersDialogOpen] = useState(false);
  const [roleChangeConfirmation, setRoleChangeConfirmation] = useState<{
    isOpen: boolean;
    userId: number | null;
    newRole: string | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    newRole: null,
    userName: "",
  });

  const kickableUsers = project.acceptedUsers?.filter(
    (user) =>
      user.id !== authUser.id &&
      ((user.pivot?.role === "project_member" && permissions.canInviteUsers) ||
        (user.pivot?.role === "project_manager" &&
          project.createdBy.id === authUser.id)),
  );

  const manageableUsers = project.acceptedUsers?.filter(
    (user) => user.id !== project.createdBy.id && user.id !== authUser.id,
  );

  const handleLeaveProject = () => {
    router.post(route("project.leave", { project: project.id }), {
      preserveScroll: true,
    });
  };

  const handleDeleteProject = () => {
    router.delete(route("project.destroy", { project: project.id }), {
      preserveScroll: true,
    });
  };

  const handleKickMembers = () => {
    router.post(
      route("project.kick-members", { project: project.id }),
      { user_ids: selectedUsers },
      {
        preserveScroll: true,
        onSuccess: () => {
          setKickDialogOpen(false);
          setSelectedUsers([]);
        },
      },
    );
  };

  const handleRoleChange = (userId: number, newRole: string, userName: string) => {
    setRoleChangeConfirmation({
      isOpen: true,
      userId,
      newRole,
      userName,
    });
  };

  const executeRoleChange = () => {
    if (roleChangeConfirmation.userId && roleChangeConfirmation.newRole) {
      router.put(
        route("project.update-user-role", { project: project.id }),
        {
          user_id: roleChangeConfirmation.userId,
          role: roleChangeConfirmation.newRole,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            setManageUsersDialogOpen(false);
            setRoleChangeConfirmation({
              isOpen: false,
              userId: null,
              newRole: null,
              userName: "",
            });
          },
        },
      );
    }
  };

  return (
    <div className="space-y-6">
      {project.image_path && (
        <div className="relative h-64 w-full overflow-hidden rounded-[2rem] shadow-xl border border-muted">
          <img
            src={project.image_path}
            alt={project.name}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8">
             <Badge variant={PROJECT_STATUS_BADGE_MAP(project.status)} className="mb-3 font-black uppercase tracking-[0.2em] px-4 py-1 shadow-lg">
               {PROJECT_STATUS_TEXT_MAP[project.status]}
             </Badge>
             <h1 className="text-4xl font-black text-white tracking-tighter italic drop-shadow-lg">
               PROYEK {project.name.toUpperCase()}
             </h1>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm rounded-[1.5rem]">
          <CardHeader className="border-b border-primary/5 bg-muted/20 rounded-t-[1.5rem]">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
               <Info className="h-5 w-5 text-primary" /> Detail Informasi Proyek
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Pemilik Proyek</Label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-primary/5">
                   <UserIcon className="h-4 w-4 text-primary" /> 
                   <span className="text-sm font-bold">{project.createdBy.name}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">ID Proyek</Label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-primary/5">
                   <Fingerprint className="h-4 w-4 text-primary" /> 
                   <span className="text-sm font-mono font-black">{project.id}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Deskripsi</Label>
              <div className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-5 rounded-2xl border-2 border-dashed border-primary/5">
                {project.description || "Tidak ada deskripsi proyek."}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary/5 rounded-[1.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                 <Calendar className="h-5 w-5" /> Lini Masa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 p-4 bg-card rounded-2xl border shadow-sm transition-all hover:border-primary/20">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tenggat Waktu</Label>
                <p className="text-lg font-black text-destructive tracking-tighter">
                  {project.due_date ? formatDate(project.due_date) : "Tanpa Batas Waktu"}
                </p>
              </div>
              <div className="flex flex-col gap-3 px-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Dibuat</span>
                  <span className="text-xs font-bold">{formatDate(project.created_at)}</span>
                </div>
                <div className="pt-3 border-t border-primary/5">
                  <Label className="text-[10px] font-bold text-primary uppercase italic">Terakhir Diperbarui</Label>
                  <p className="text-sm font-bold truncate mt-1">{project.updatedBy.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-blue-600 text-white rounded-[1.5rem] overflow-hidden group">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <Files className="h-6 w-6 text-white" />
                  </div>
                  <Link href={route('project.assets', project.id)}>
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg transition-transform group-hover:translate-x-1">
                       <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
               </div>
               <h3 className="text-xl font-black italic tracking-tighter mb-1">GALERI ASET</h3>
               <p className="text-xs font-medium text-white/80">Kelola semua lampiran dan dokumen proyek dalam satu tempat terpusat.</p>
               <Link href={route('project.assets', project.id)} className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest hover:underline">
                 Buka Galeri Sekarang &rarr;
               </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[1.5rem] overflow-hidden">
        <CardHeader className="border-b border-primary/5 bg-muted/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-primary" /> Kolaborator Tim
            </CardTitle>
            <div className="flex gap-2">
               {permissions.canInviteUsers && (
                 <Button variant="outline" size="sm" className="font-bold border-primary/20 hover:bg-primary/5 rounded-xl" onClick={onInviteClick}>
                    <UsersRound className="mr-2 h-4 w-4" /> Undang
                 </Button>
               )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
             {/* Creator */}
             <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-inner">
                <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                  <AvatarImage src={project.createdBy.profile_picture} />
                  <AvatarFallback className="bg-primary text-white font-black">{project.createdBy.name[0]}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-black truncate text-primary uppercase tracking-tighter">{project.createdBy.name}</p>
                  <Badge className="text-[9px] font-black uppercase bg-primary/20 text-primary border-none">Pemilik</Badge>
                </div>
             </div>

             {project.acceptedUsers?.filter(u => u.id !== project.createdBy.id).map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl border border-primary/5 bg-card hover:bg-muted/30 transition-all group relative">
                   <Avatar className="h-11 w-11 shadow-sm transition-transform group-hover:scale-105">
                     <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                     <AvatarFallback className="font-bold">{user.name[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate text-foreground/90">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                        {user.pivot?.role === 'project_manager' ? 'Manager' : 'Anggota'}
                      </p>
                   </div>
                </div>
             ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-dashed border-primary/10">
             {permissions.canInviteUsers && kickableUsers && kickableUsers.length > 0 && (
               <Dialog open={isKickDialogOpen} onOpenChange={setKickDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold gap-2 text-destructive border-destructive/20 hover:bg-destructive/5 rounded-xl">
                       <UserMinus className="h-4 w-4" /> Keluarkan Anggota
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">Hapus Anggota Tim</DialogTitle>
                      <DialogDescription>Pilih anggota yang ingin dikeluarkan dari proyek ini.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       {kickableUsers.map(user => (
                         <div key={user.id} className="flex items-center gap-3 p-3 border border-primary/5 rounded-2xl hover:bg-muted/20 transition-colors">
                            <Checkbox id={`user-${user.id}`} checked={selectedUsers.includes(user.id)} onCheckedChange={(c) => c ? setSelectedUsers([...selectedUsers, user.id]) : setSelectedUsers(selectedUsers.filter(id => id !== user.id))} />
                            <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer font-bold text-sm">{user.name}</Label>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">{ROLE_TEXT_MAP[user.pivot?.role as keyof typeof ROLE_TEXT_MAP]}</Badge>
                         </div>
                       ))}
                       <div className="flex justify-end gap-3 pt-6">
                          <Button variant="ghost" onClick={() => setKickDialogOpen(false)} className="font-bold">Batal</Button>
                          <Button variant="destructive" disabled={selectedUsers.length === 0} onClick={handleKickMembers} className="font-black px-8 shadow-lg shadow-destructive/20 uppercase tracking-widest text-xs">
                            Keluarkan ({selectedUsers.length})
                          </Button>
                       </div>
                    </div>
                  </DialogContent>
               </Dialog>
             )}
             {manageableUsers && manageableUsers.length > 0 && (
               <Dialog open={isManageUsersDialogOpen} onOpenChange={setManageUsersDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold gap-2 border-primary/20 rounded-xl">
                       <UserCog className="h-4 w-4" /> Atur Hak Akses
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">Kelola Peran Anggota</DialogTitle>
                      <DialogDescription>Sesuaikan otoritas setiap kolaborator dalam proyek ini.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       {manageableUsers.map(user => (
                         <div key={user.id} className="flex flex-wrap items-center justify-between gap-4 p-4 border border-primary/5 rounded-2xl bg-muted/10">
                            <div className="flex items-center gap-3 truncate">
                               <Avatar className="h-10 w-10 border border-white shadow-sm"><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
                               <span className="text-sm font-black truncate uppercase tracking-tighter">{user.name}</span>
                            </div>
                            <Select value={user.pivot?.role} onValueChange={(v) => handleRoleChange(user.id, v, user.name)} disabled={!permissions.canInviteUsers || (user.pivot?.role === "project_manager" && project.createdBy.id !== authUser.id)}>
                               <SelectTrigger className="w-36 rounded-xl font-bold bg-card"><SelectValue /></SelectTrigger>
                               <SelectContent className="rounded-xl">
                                  <SelectItem value="project_manager" className="font-bold">Manager</SelectItem>
                                  <SelectItem value="project_member" className="font-bold">Anggota</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                       ))}
                    </div>
                  </DialogContent>
               </Dialog>
             )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl rounded-[2.5rem] border-t border-white/10">
        <CardContent className="py-8">
           <div className="flex flex-wrap items-center justify-center gap-4">
              {permissions.canEditProject && (
                <>
                  <Link href={route("project.edit", project.id)}>
                    <Button variant="outline" className="font-black gap-2 h-12 rounded-2xl border-primary/20 hover:bg-primary/5 shadow-sm px-6">
                       <Pencil className="h-4 w-4" /> EDIT PROYEK
                    </Button>
                  </Link>
                  <Link href={route("project.labels.index", project.id)}>
                    <Button variant="outline" className="font-black gap-2 h-12 rounded-2xl border-primary/20 hover:bg-primary/5 shadow-sm px-6">
                       <Tag className="h-4 w-4" /> LABEL TUGAS
                    </Button>
                  </Link>
                  <Link href={route("project.statuses.index", project.id)}>
                    <Button variant="outline" className="font-black gap-2 h-12 rounded-2xl border-primary/20 hover:bg-primary/5 shadow-sm px-6">
                       <Settings className="h-4 w-4" /> ALUR KERJA
                    </Button>
                  </Link>
                </>
              )}
              <Link href={route("kanban.show", project.id)}>
                <Button className="font-black h-12 gap-3 shadow-xl shadow-primary/20 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs">
                   <LayoutDashboard className="h-5 w-5" /> BUKA KANBAN
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => setDialogOpen(true)} className="font-black h-12 gap-2 shadow-xl shadow-destructive/20 px-8 rounded-2xl uppercase tracking-widest text-xs">
                 {project.createdBy.id === authUser.id ? <CircleX className="h-5 w-5" /> : <LogOut className="h-5 w-5" />}
                 {project.createdBy.id === authUser.id ? "HAPUS PROYEK" : "KELUAR PROYEK"}
              </Button>
           </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-none shadow-2xl rounded-[3rem] p-8">
          <div className="flex flex-col items-center text-center space-y-6 pt-4">
             <div className="p-6 rounded-full bg-destructive/10 animate-pulse text-destructive">
                <ShieldAlert className="h-12 w-12" />
             </div>
             <div className="space-y-2">
               <AlertDialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                  {project.createdBy.id === authUser.id ? "HAPUS PROYEK SELAMANYA?" : "TINGGALKAN PROYEK?"}
               </AlertDialogTitle>
               <AlertDialogDescription className="text-lg font-medium text-muted-foreground leading-relaxed">
                  {project.createdBy.id === authUser.id 
                    ? "Tindakan ini tidak dapat dibatalkan. Semua tugas, data, dan riwayat di dalamnya akan dihapus permanen!" 
                    : "Apakah Anda yakin ingin keluar dari kolaborasi proyek ini?"}
               </AlertDialogDescription>
             </div>
          </div>
          <AlertDialogFooter className="mt-10 flex flex-col sm:flex-row gap-4">
            <AlertDialogCancel className="h-14 font-black rounded-2xl bg-muted/50 border-none transition-all hover:bg-muted text-xs uppercase tracking-widest">Batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={() => { project.createdBy.id === authUser.id ? handleDeleteProject() : handleLeaveProject(); setDialogOpen(false); }} className="h-14 bg-destructive text-destructive-foreground font-black rounded-2xl shadow-xl shadow-destructive/20 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest px-8">
               {project.createdBy.id === authUser.id ? "YA, HAPUS SEKARANG" : "YA, KELUAR"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={roleChangeConfirmation.isOpen} onOpenChange={(o) => setRoleChangeConfirmation(p => ({ ...p, isOpen: o }))}>
        <AlertDialogContent className="border-none shadow-2xl rounded-[2.5rem] p-8">
          <AlertDialogTitle className="text-2xl font-black italic tracking-tighter uppercase">Konfirmasi Perubahan Peran</AlertDialogTitle>
          <AlertDialogDescription className="text-base font-medium mt-2">
            Ganti peran <span className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">{roleChangeConfirmation.userName}</span> menjadi 
            <span className="font-black text-primary ml-1 uppercase">
               {roleChangeConfirmation.newRole === "project_manager" ? "Project Manager" : "Project Member"}
            </span>?
          </AlertDialogDescription>
          {roleChangeConfirmation.newRole === "project_manager" && (
            <div className="mt-6 p-5 rounded-[1.5rem] bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500/30 text-amber-800 dark:text-amber-200 shadow-inner">
              <p className="flex items-center gap-2 font-black text-xs uppercase mb-3"><ShieldAlert className="h-5 w-5" /> PERINGATAN MANAJER:</p>
              <ul className="text-xs space-y-2 font-bold list-disc ml-5">
                <li>Dapat mengelola tugas, label, dan alur kerja</li>
                <li>Dapat mengundang anggota baru ke proyek</li>
                <li>Dapat mempromosikan anggota lain menjadi Manager</li>
              </ul>
            </div>
          )}
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel onClick={() => setRoleChangeConfirmation({ isOpen: false, userId: null, newRole: null, userName: "" })} className="border-none font-bold">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeRoleChange} className="font-black shadow-lg rounded-xl px-6 uppercase tracking-widest text-[10px]">Konfirmasi Perubahan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}