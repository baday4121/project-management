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
  Mail,
  Fingerprint
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
      {/* Gambar Proyek Utama */}
      {project.image_path && (
        <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-md border border-muted">
          <img
            src={project.image_path}
            alt={project.name}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6">
             <Badge variant={PROJECT_STATUS_BADGE_MAP(project.status)} className="mb-2 font-bold uppercase tracking-wider">
               {PROJECT_STATUS_TEXT_MAP[project.status]}
             </Badge>
             <h1 className="text-3xl font-black text-white italic">PROYEK {project.name.toUpperCase()}</h1>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Informasi Utama */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
               <Info className="h-5 w-5 text-primary" /> Detail Informasi Proyek
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Pemilik Proyek</Label>
                <div className="flex items-center gap-2 text-sm font-medium">
                   <UserIcon className="h-4 w-4 text-primary" /> {project.createdBy.name}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">ID Proyek</Label>
                <div className="flex items-center gap-2 text-sm font-mono font-bold">
                   <Fingerprint className="h-4 w-4 text-primary" /> {project.id}
                </div>
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Deskripsi</Label>
              <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg border border-dashed">
                {project.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline & Metadata */}
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
               <Calendar className="h-5 w-5" /> Lini Masa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 p-3 bg-card rounded-lg border shadow-sm">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Tenggat Waktu</Label>
              <p className="text-md font-black text-destructive tracking-tight">
                {project.due_date ? formatDate(project.due_date) : "Tanpa Batas Waktu"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Dibuat Pada</Label>
              <p className="text-sm font-medium">{formatDate(project.created_at)}</p>
            </div>
            <div className="space-y-1 pt-2 border-t border-primary/10">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase italic text-primary">Terakhir Diperbarui Oleh</Label>
              <p className="text-sm font-bold truncate">{project.updatedBy.name}</p>
              <p className="text-xs text-muted-foreground truncate">{project.updatedBy.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anggota Tim */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b bg-muted/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-primary" /> Kolaborator Tim
            </CardTitle>
            <div className="flex gap-2">
               {permissions.canInviteUsers && (
                 <Button variant="outline" size="sm" className="font-bold border-primary/20 hover:bg-primary/5" onClick={onInviteClick}>
                    <UsersRound className="mr-2 h-4 w-4" /> Undang
                 </Button>
               )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Creator */}
             <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/20 bg-primary/5 shadow-sm">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={project.createdBy.profile_picture} />
                  <AvatarFallback>{project.createdBy.name[0]}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">{project.createdBy.name}</p>
                  <Badge variant="secondary" className="text-[9px] font-black uppercase">Pemilik (PM)</Badge>
                </div>
             </div>

             {/* Accepted Members */}
             {project.acceptedUsers?.filter(u => u.id !== project.createdBy.id).map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all group">
                   <Avatar className="h-10 w-10">
                     <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                     <AvatarFallback>{user.name[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{user.pivot?.role === 'project_manager' ? 'Manager' : 'Anggota'}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-dashed">
             {permissions.canInviteUsers && kickableUsers && kickableUsers.length > 0 && (
               <Dialog open={isKickDialogOpen} onOpenChange={setKickDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold gap-2 text-destructive border-destructive/20 hover:bg-destructive/5">
                       <UserMinus className="h-4 w-4" /> Keluarkan Anggota
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Hapus Anggota Dari Tim</DialogTitle>
                      <DialogDescription>Pilih anggota yang ingin dikeluarkan dari proyek ini.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       {kickableUsers.map(user => (
                         <div key={user.id} className="flex items-center gap-3 p-2 border rounded-lg">
                            <Checkbox id={`user-${user.id}`} checked={selectedUsers.includes(user.id)} onCheckedChange={(c) => c ? setSelectedUsers([...selectedUsers, user.id]) : setSelectedUsers(selectedUsers.filter(id => id !== user.id))} />
                            <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer font-bold">{user.name}</Label>
                            <Badge variant="outline" className="text-[10px] uppercase">{ROLE_TEXT_MAP[user.pivot?.role as keyof typeof ROLE_TEXT_MAP]}</Badge>
                         </div>
                       ))}
                       <div className="flex justify-end gap-2 pt-4">
                          <Button variant="ghost" onClick={() => setKickDialogOpen(false)}>Batal</Button>
                          <Button variant="destructive" disabled={selectedUsers.length === 0} onClick={handleKickMembers}>Keluarkan ({selectedUsers.length})</Button>
                       </div>
                    </div>
                  </DialogContent>
               </Dialog>
             )}
             {manageableUsers && manageableUsers.length > 0 && (
               <Dialog open={isManageUsersDialogOpen} onOpenChange={setManageUsersDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold gap-2 border-primary/20">
                       <UserCog className="h-4 w-4" /> Atur Hak Akses
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Kelola Peran Anggota</DialogTitle>
                      <DialogDescription>Hanya pemilik proyek yang dapat menurunkan jabatan Manager ke Anggota.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       {manageableUsers.map(user => (
                         <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-xl">
                            <div className="flex items-center gap-2 truncate max-w-[150px]">
                               <Avatar className="h-8 w-8"><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
                               <span className="text-sm font-bold truncate">{user.name}</span>
                            </div>
                            <Select value={user.pivot?.role} onValueChange={(v) => handleRoleChange(user.id, v, user.name)} disabled={!permissions.canInviteUsers || (user.pivot?.role === "project_manager" && project.createdBy.id !== authUser.id)}>
                               <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                               <SelectContent>
                                  <SelectItem value="project_manager">Manager</SelectItem>
                                  <SelectItem value="project_member">Anggota</SelectItem>
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

      {/* Panel Aksi */}
      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md">
        <CardContent className="pt-6">
           <div className="flex flex-wrap items-center justify-center gap-3">
              {permissions.canEditProject && (
                <>
                  <Link href={route("project.edit", project.id)}>
                    <Button variant="outline" className="font-bold gap-2 border-primary/20 hover:bg-primary/5 shadow-sm">
                       <Pencil className="h-4 w-4" /> Edit Proyek
                    </Button>
                  </Link>
                  <Link href={route("project.labels.index", project.id)}>
                    <Button variant="outline" className="font-bold gap-2 border-primary/20 hover:bg-primary/5 shadow-sm">
                       <Tag className="h-4 w-4" /> Label Tugas
                    </Button>
                  </Link>
                  <Link href={route("project.statuses.index", project.id)}>
                    <Button variant="outline" className="font-bold gap-2 border-primary/20 hover:bg-primary/5 shadow-sm">
                       <Settings className="h-4 w-4" /> Alur Kerja
                    </Button>
                  </Link>
                </>
              )}
              <Link href={route("kanban.show", project.id)}>
                <Button className="font-black gap-2 shadow-lg shadow-primary/20 px-8 transition-all hover:scale-105">
                   <LayoutDashboard className="h-5 w-5" /> BUKA KANBAN
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => setDialogOpen(true)} className="font-bold gap-2 shadow-lg shadow-destructive/20 px-6">
                 {project.createdBy.id === authUser.id ? <CircleX className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                 {project.createdBy.id === authUser.id ? "HAPUS PROYEK" : "KELUAR PROYEK"}
              </Button>
           </div>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Utama */}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-none shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
             <div className="p-4 rounded-full bg-destructive/10 animate-pulse text-destructive">
                <ShieldAlert className="h-10 w-10" />
             </div>
             <AlertDialogTitle className="text-2xl font-black italic tracking-tighter">
                {project.createdBy.id === authUser.id ? "HAPUS PROYEK SELAMANYA?" : "TINGGALKAN PROYEK?"}
             </AlertDialogTitle>
             <AlertDialogDescription className="text-base font-medium">
                {project.createdBy.id === authUser.id 
                  ? "Tindakan ini tidak dapat dibatalkan. Semua tugas, data, dan riwayat di dalamnya akan dihapus permanen!" 
                  : "Apakah Anda yakin ingin keluar dari kolaborasi proyek ini?"}
             </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="h-12 font-bold bg-muted/50 border-none">Batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={() => { project.createdBy.id === authUser.id ? handleDeleteProject() : handleLeaveProject(); setDialogOpen(false); }} className="h-12 bg-destructive text-destructive-foreground font-black shadow-lg shadow-destructive/20">
               {project.createdBy.id === authUser.id ? "YA, HAPUS SEKARANG" : "YA, KELUAR"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Role */}
      <AlertDialog open={roleChangeConfirmation.isOpen} onOpenChange={(o) => setRoleChangeConfirmation(p => ({ ...p, isOpen: o }))}>
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogTitle className="text-xl font-bold">Konfirmasi Perubahan Peran</AlertDialogTitle>
          <AlertDialogDescription>
            Ganti peran <span className="font-bold text-foreground underline">{roleChangeConfirmation.userName}</span> menjadi 
            <span className="font-black text-primary ml-1">
               {roleChangeConfirmation.newRole === "project_manager" ? "Project Manager" : "Project Member"}
            </span>?
          </AlertDialogDescription>
          {roleChangeConfirmation.newRole === "project_manager" && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500/30 text-amber-800 dark:text-amber-200">
              <p className="flex items-center gap-2 font-black text-xs uppercase mb-2"><ShieldAlert className="h-4 w-4" /> PERINGATAN MANAJER:</p>
              <ul className="text-xs space-y-1 font-medium list-disc ml-4">
                <li>Dapat mengelola tugas dan label</li>
                <li>Dapat mengundang anggota baru</li>
                <li>Dapat mempromosikan anggota lain</li>
              </ul>
            </div>
          )}
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setRoleChangeConfirmation({ isOpen: false, userId: null, newRole: null, userName: "" })} className="border-none">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeRoleChange} className="font-black shadow-lg">Konfirmasi Perubahan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}