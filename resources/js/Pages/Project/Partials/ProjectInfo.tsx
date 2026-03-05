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
  Hash,
  User,
  AlertTriangle,
  Info,
  Clock,
  ArrowUpRight
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
    (user) =>
      user.id !== project.createdBy.id && user.id !== authUser.id,
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Banner / Hero Section */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl border shadow-2xl transition-all duration-500 hover:shadow-primary/5">
        {project.image_path ? (
          <img
            src={project.image_path}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/5 to-background">
             <LayoutDashboard className="h-20 w-20 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
             <Badge variant={PROJECT_STATUS_BADGE_MAP(project.status)} className="mb-2 font-black uppercase tracking-widest shadow-lg">
                {PROJECT_STATUS_TEXT_MAP[project.status]}
             </Badge>
             <h1 className="text-4xl font-black italic tracking-tighter text-foreground drop-shadow-sm md:text-5xl uppercase">
               WorkDei {project.name}
             </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
             <Hash className="h-4 w-4" /> ID: {project.id}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info Card */}
        <Card className="lg:col-span-2 border-none bg-card/50 shadow-md backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
               <Info className="h-5 w-5 text-primary" /> Ringkasan Proyek
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
               <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pemilik Proyek</Label>
                  <div className="flex items-center gap-2">
                     <Avatar className="h-6 w-6 border">
                        <AvatarImage src={project.createdBy.profile_picture} />
                        <AvatarFallback>{project.createdBy.name[0]}</AvatarFallback>
                     </Avatar>
                     <p className="text-sm font-bold">{project.createdBy.name}</p>
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Kontak</Label>
                  <p className="text-sm font-medium text-muted-foreground">{project.createdBy.email}</p>
               </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deskripsi Proyek</Label>
               <p className="text-sm leading-relaxed text-muted-foreground">
                 {project.description || "Tidak ada deskripsi untuk proyek ini."}
               </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline & Stats Card */}
        <Card className="border-none bg-primary/5 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
               <Clock className="h-5 w-5 text-primary" /> Lini Masa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="rounded-2xl bg-background p-4 shadow-sm border">
                <Label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tenggat Waktu</Label>
                <p className="text-2xl font-black tracking-tighter text-destructive italic">
                  {project.due_date ? formatDate(project.due_date) : "Tanpa Deadline"}
                </p>
             </div>
             <div className="space-y-4 px-1">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dibuat Pada</span>
                   <span className="text-xs font-bold">{formatDate(project.created_at)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Terakhir Oleh</span>
                   <span className="text-xs font-bold italic text-primary">{project.updatedBy.name}</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Section */}
      <Card className="border-none shadow-xl">
        <CardHeader className="border-b bg-muted/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <UsersRound className="h-5 w-5 text-primary" /> Kolaborator Tim
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {permissions.canInviteUsers && (
                <Button variant="outline" size="sm" className="font-bold border-primary/20 hover:bg-primary/5" onClick={onInviteClick}>
                  <UsersRound className="mr-2 h-4 w-4" /> Undang
                </Button>
              )}
              {permissions.canInviteUsers && kickableUsers && kickableUsers.length > 0 && (
                <Dialog open={isKickDialogOpen} onOpenChange={setKickDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold text-destructive border-destructive/20 hover:bg-destructive/5">
                      <UserMinus className="mr-2 h-4 w-4" /> Keluarkan Anggota
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Pilih Anggota yang Ingin Dikeluarkan</DialogTitle>
                      <DialogDescription>Mengeluarkan anggota akan otomatis melepas mereka dari tugas yang sedang dikerjakan.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-3">
                      {kickableUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => {
                              setSelectedUsers(checked ? [...selectedUsers, user.id] : selectedUsers.filter((id) => id !== user.id));
                            }}
                          />
                          <Avatar className="h-8 w-8">
                             <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                             <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer text-sm font-bold">
                            {user.name} <span className="text-[10px] font-normal text-muted-foreground">({ROLE_TEXT_MAP[user.pivot?.role as keyof typeof ROLE_TEXT_MAP]})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="ghost" className="font-bold" onClick={() => setKickDialogOpen(false)}>Batal</Button>
                      <Button variant="destructive" className="font-black" disabled={selectedUsers.length === 0} onClick={handleKickMembers}>Keluarkan ({selectedUsers.length}) Anggota</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {manageableUsers && manageableUsers.length > 0 && (
                <Dialog open={isManageUsersDialogOpen} onOpenChange={setManageUsersDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold border-primary/20 hover:bg-primary/5">
                      <UserCog className="mr-2 h-4 w-4" /> Kelola Peran
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Kelola Hak Akses Anggota</DialogTitle>
                      <DialogDescription>Atur siapa yang memiliki akses manajerial dalam proyek ini.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-4">
                      {manageableUsers.map((user) => (
                        <div key={user.id} className="flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold">{user.name}</p>
                              <p className="text-[10px] font-medium text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Select
                            value={user.pivot?.role}
                            onValueChange={(value) => handleRoleChange(user.id, value, user.name)}
                            disabled={!permissions.canInviteUsers || (user.pivot?.role === "project_manager" && project.createdBy.id !== authUser.id)}
                          >
                            <SelectTrigger className="w-[180px] font-bold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="project_manager">Project Manager</SelectItem>
                              <SelectItem value="project_member">Project Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
             {/* Creator Avatar Card */}
             <div className="flex items-center gap-3 rounded-2xl bg-primary/10 p-4 border border-primary/20 shadow-sm">
                <Avatar className="h-12 w-12 border-2 border-primary shadow-sm">
                   <AvatarImage src={project.createdBy.profile_picture} />
                   <AvatarFallback>{project.createdBy.name[0]}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                   <p className="truncate text-sm font-black uppercase tracking-tight">{project.createdBy.name}</p>
                   <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest">Pemilik</Badge>
                </div>
             </div>
             
             {/* Accepted Members */}
             {project.acceptedUsers?.filter((u) => u.id !== project.createdBy.id).map((user) => (
               <div key={user.id} className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md group">
                  <Avatar className="h-12 w-12 grayscale group-hover:grayscale-0 transition-all duration-300">
                    <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-bold group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                       {user.pivot?.role === "project_manager" ? "Manager" : "Anggota"}
                    </p>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* Global Action Bar */}
      <Card className="border-none bg-card/80 shadow-2xl backdrop-blur-md">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {permissions.canEditProject && (
              <>
                <Link href={route("project.edit", project.id)}>
                  <Button variant="outline" className="font-bold gap-2 border-primary/20 hover:bg-primary/5 shadow-sm">
                    <Pencil className="h-4 w-4" /> Edit Detail
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
            <Button 
              variant="destructive" 
              className="font-bold gap-2 shadow-lg shadow-destructive/20 px-6" 
              onClick={() => setDialogOpen(true)}
            >
              {project.createdBy.id === authUser.id ? <CircleX className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
              {project.createdBy.id === authUser.id ? "HAPUS PROYEK" : "KELUAR PROYEK"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Delete / Leave Confirmation */}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-none shadow-2xl">
          <div className="flex flex-col items-center space-y-4 pt-4 text-center">
             <div className="p-4 rounded-full bg-destructive/10 text-destructive animate-pulse">
                <AlertTriangle className="h-10 w-10" />
             </div>
             <AlertDialogTitle className="text-2xl font-black italic tracking-tighter">
               {project.createdBy.id === authUser.id ? "KONFIRMASI HAPUS PROYEK" : "TINGGALKAN PROYEK INI?"}
             </AlertDialogTitle>
             <AlertDialogDescription className="text-base font-medium">
               {project.createdBy.id === authUser.id
                 ? "Apakah Anda benar-benar ingin menghapus proyek ini? Seluruh data tugas dan histori akan hilang selamanya. Tindakan ini tidak dapat dibatalkan!"
                 : "Apakah Anda yakin ingin meninggalkan proyek ini? Anda tidak akan lagi memiliki akses ke konten tim."}
             </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="h-12 font-bold bg-muted/50 border-none">Batalkan</AlertDialogCancel>
            <AlertDialogAction
              className="h-12 bg-destructive font-black text-destructive-foreground shadow-lg shadow-destructive/20"
              onClick={() => {
                project.createdBy.id === authUser.id ? handleDeleteProject() : handleLeaveProject();
                setDialogOpen(false);
              }}
            >
              {project.createdBy.id === authUser.id ? "YA, HAPUS SEKARANG" : "YA, KELUAR"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Role Change Confirmation */}
      <AlertDialog open={roleChangeConfirmation.isOpen} onOpenChange={(isOpen) => setRoleChangeConfirmation((prev) => ({ ...prev, isOpen }))}>
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 italic">
            <UserCog className="h-6 w-6 text-primary" /> Konfirmasi Perubahan Peran
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Apakah Anda yakin ingin mengubah peran <span className="font-bold text-foreground">{roleChangeConfirmation.userName}</span> menjadi{" "}
            <span className="font-bold text-primary">{roleChangeConfirmation.newRole === "project_manager" ? "Project Manager" : "Project Member"}</span>?
          </AlertDialogDescription>
          {roleChangeConfirmation.newRole === "project_manager" && (
            <div className="mt-4 rounded-2xl border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm font-medium text-yellow-600 dark:text-yellow-200">
               <div className="flex items-center gap-2 mb-2 font-black italic">
                  <AlertTriangle className="h-4 w-4" /> PERHATIAN:
               </div>
               <ul className="ml-4 list-disc space-y-1">
                 <li>Dapat mengelola tugas dan label</li>
                 <li>Dapat mengundang anggota baru</li>
                 <li>Dapat mempromosikan anggota lain</li>
               </ul>
            </div>
          )}
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="font-bold border-none" onClick={() => setRoleChangeConfirmation({ isOpen: false, userId: null, newRole: null, userName: "" })}>Batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={executeRoleChange} className="font-black">Konfirmasi Perubahan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}