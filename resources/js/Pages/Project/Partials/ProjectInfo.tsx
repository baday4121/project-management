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
  Info,
  User as UserIcon,
  ShieldAlert,
  Clock,
  ExternalLink,
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
    <div className="space-y-6">
      {/* Gambar Banner Proyek */}
      {project.image_path && (
        <div className="relative group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
           <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
             <Badge className="bg-white/20 backdrop-blur-md text-white border-none">Gambar Proyek</Badge>
           </div>
           <img
             src={project.image_path}
             alt={project.name}
             className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
             style={{ maxHeight: "320px", minHeight: "200px" }}
           />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Informasi Utama & Deskripsi */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3 border-b">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Detail Proyek</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ID Proyek</Label>
                  <p className="font-mono text-sm font-medium">#{project.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
                  <div>
                    <Badge variant={PROJECT_STATUS_BADGE_MAP(project.status)} className="px-3 py-1 text-xs font-bold shadow-sm">
                      {PROJECT_STATUS_TEXT_MAP[project.status]}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nama Proyek</Label>
                  <p className="text-lg font-black text-foreground">{project.name}</p>
                </div>
                <div className="space-y-1 md:col-span-2 p-4 rounded-lg bg-muted/30">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <UserIcon className="h-3 w-3" /> Pembuat Proyek
                  </Label>
                  <div className="flex items-center gap-3 pt-2">
                     <Avatar className="h-8 w-8 border">
                        <AvatarImage src={project.createdBy.profile_picture} />
                        <AvatarFallback>{project.createdBy.name.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div>
                       <p className="text-sm font-bold leading-none">{project.createdBy.name}</p>
                       <p className="text-xs text-muted-foreground">{project.createdBy.email}</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deskripsi Proyek</Label>
                <div className="rounded-lg bg-muted/20 p-4 border border-dashed">
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                    {project.description || "Tidak ada deskripsi untuk proyek ini."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kolom Anggota Tim */}
          <Card className="shadow-sm border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-3">
                <UsersRound className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Anggota Tim</CardTitle>
              </div>
              <div className="flex gap-2">
                {permissions.canInviteUsers && (
                  <Button variant="outline" size="sm" onClick={onInviteClick} className="font-bold border-primary/20 hover:bg-primary/5">
                    <UsersRound className="h-4 w-4 mr-2" /> Undang
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pemilik/Kreator */}
                <div className="flex items-center p-3 space-x-3 rounded-xl border bg-primary/5 border-primary/20">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={project.createdBy.profile_picture} alt={project.createdBy.name} />
                    <AvatarFallback>{project.createdBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate leading-none mb-1">{project.createdBy.name}</p>
                    <div className="flex gap-1">
                      <Badge className="bg-primary text-[9px] h-4 font-bold uppercase">Pemilik</Badge>
                      {project.acceptedUsers?.some(u => u.id === project.createdBy.id && u.pivot?.role === "project_manager") && (
                        <Badge variant="outline" className="text-[9px] h-4 font-bold border-primary/50 text-primary uppercase">PM</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Anggota Lainnya */}
                {project.acceptedUsers?.filter((user) => user.id !== project.createdBy.id).map((user) => (
                  <div key={user.id} className="flex items-center p-3 space-x-3 rounded-xl border hover:bg-muted/30 transition-colors">
                    <Avatar className="h-10 w-10 shadow-sm">
                      <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate leading-none mb-1">{user.name}</p>
                      <Badge variant="secondary" className="text-[9px] h-4 font-bold uppercase tracking-wider">
                        {user.pivot?.role === "project_manager" ? "Project Manager" : "Member"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {permissions.canInviteUsers && (
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-dashed">
                  {kickableUsers && kickableUsers.length > 0 && (
                    <Dialog open={isKickDialogOpen} onOpenChange={setKickDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive font-bold hover:bg-destructive/10">
                          <UserMinus className="h-4 w-4 mr-2" /> Keluarkan Anggota
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold italic uppercase tracking-tighter">Pilih Anggota untuk Dihapus</DialogTitle>
                          <DialogDescription>
                            Mengeluarkan pengguna akan melepaskan penugasan mereka dari semua tugas di proyek ini.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-4 overflow-y-auto pr-2">
                          {kickableUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`user-${user.id}`}
                                  checked={selectedUsers.includes(user.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) setSelectedUsers([...selectedUsers, user.id]);
                                    else setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                                  }}
                                />
                                <Avatar className="h-8 w-8">
                                   <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                                   <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <label htmlFor={`user-${user.id}`} className="text-sm font-bold cursor-pointer">
                                  {user.name} <span className="text-xs font-normal text-muted-foreground italic">({ROLE_TEXT_MAP[user.pivot?.role as keyof typeof ROLE_TEXT_MAP]})</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setKickDialogOpen(false)}>Batal</Button>
                          <Button variant="destructive" disabled={selectedUsers.length === 0} onClick={handleKickMembers} className="font-bold">
                            Keluarkan ({selectedUsers.length})
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {manageableUsers && manageableUsers.length > 0 && (
                    <Dialog open={isManageUsersDialogOpen} onOpenChange={setManageUsersDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/10">
                          <UserCog className="h-4 w-4 mr-2" /> Atur Peran
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold italic uppercase tracking-tighter">Kelola Peran Anggota</DialogTitle>
                          <DialogDescription>
                            Promosikan anggota menjadi Manajer Proyek untuk membantu mengelola tugas.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4 overflow-y-auto pr-2">
                          {manageableUsers.map((user) => (
                            <div key={user.id} className="flex flex-col gap-3 p-4 rounded-xl border bg-muted/10 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border shadow-sm">
                                  <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-black">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                              <Select
                                value={user.pivot?.role}
                                onValueChange={(value) => handleRoleChange(user.id, value, user.name)}
                                disabled={!permissions.canInviteUsers || (user.pivot?.role === "project_manager" && project.createdBy.id !== authUser.id)}
                              >
                                <SelectTrigger className="w-full sm:w-[160px] font-bold">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="project_manager" className="font-bold text-primary">Manajer Proyek</SelectItem>
                                  <SelectItem value="project_member" className="font-bold">Anggota Proyek</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Timeline & Aksi Cepat */}
        <div className="space-y-6">
          <Card className="shadow-sm border-none bg-primary/5 border-t-4 border-t-primary">
            <CardHeader className="pb-3 border-b border-primary/10">
              <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Lini Masa
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="p-4 rounded-xl bg-background border flex items-center gap-4">
                 <Calendar className="h-8 w-8 text-primary opacity-50" />
                 <div>
                   <Label className="text-[10px] font-black uppercase text-muted-foreground">Tenggat Waktu</Label>
                   <p className="text-lg font-black tracking-tighter text-destructive">
                      {project.due_date ? formatDate(project.due_date) : "Tanpa Batas"}
                   </p>
                 </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Dibuat</span>
                  <span className="font-bold">{formatDate(project.created_at)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t">
                  <span className="text-muted-foreground font-medium">Diperbarui Oleh</span>
                  <span className="font-bold italic">{project.updatedBy.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" /> Navigasi Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
               <Link href={route("kanban.show", project.id)} className="block">
                <Button className="w-full justify-between h-12 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Papan Kanban
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>

              {permissions.canEditProject && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link href={route("project.edit", project.id)}>
                    <Button variant="outline" className="w-full justify-start font-bold h-11 border-primary/20 hover:bg-primary/5">
                      <Pencil className="h-4 w-4 mr-3 text-primary" /> Edit Proyek
                    </Button>
                  </Link>
                  <Link href={route("project.labels.index", project.id)}>
                    <Button variant="outline" className="w-full justify-start font-bold h-11 border-primary/20 hover:bg-primary/5">
                      <Tag className="h-4 w-4 mr-3 text-primary" /> Kelola Label
                    </Button>
                  </Link>
                  <Link href={route("project.statuses.index", project.id)}>
                    <Button variant="outline" className="w-full justify-start font-bold h-11 border-primary/20 hover:bg-primary/5">
                      <Settings className="h-4 w-4 mr-3 text-primary" /> Atur Alur Status
                    </Button>
                  </Link>
                </div>
              )}

              <div className="pt-4 mt-2 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full h-11 font-black shadow-lg shadow-destructive/10" 
                  onClick={() => setDialogOpen(true)}
                >
                  {project.createdBy.id === authUser.id ? (
                    <><CircleX className="h-4 w-4 mr-3" /> Hapus Proyek</>
                  ) : (
                    <><LogOut className="h-4 w-4 mr-3" /> Keluar dari Proyek</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AlertDialog: Konfirmasi Hapus/Keluar */}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-none shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
             <div className="p-4 rounded-full bg-destructive/10 text-destructive animate-pulse">
                <ShieldAlert className="h-10 w-10" />
             </div>
             <AlertDialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
               {project.createdBy.id === authUser.id ? "Hapus Proyek?" : "Keluar Proyek?"}
             </AlertDialogTitle>
             <AlertDialogDescription className="text-base font-medium">
               {project.createdBy.id === authUser.id
                 ? "Semua data, tugas, dan histori proyek ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
                 : "Anda akan kehilangan akses ke kolaborasi tim di proyek ini."}
             </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="mt-8 gap-3 flex-col sm:flex-row">
            <AlertDialogCancel className="h-12 font-bold border-none bg-muted hover:bg-muted/80">Batalkan</AlertDialogCancel>
            <AlertDialogAction
              className="h-12 bg-destructive text-destructive-foreground font-black shadow-lg shadow-destructive/20"
              onClick={() => {
                project.createdBy.id === authUser.id ? handleDeleteProject() : handleLeaveProject();
                setDialogOpen(false);
              }}
            >
              {project.createdBy.id === authUser.id ? "Ya, Hapus Sekarang" : "Ya, Saya Keluar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Konfirmasi Perubahan Peran */}
      <AlertDialog
        open={roleChangeConfirmation.isOpen}
        onOpenChange={(isOpen) => setRoleChangeConfirmation((prev) => ({ ...prev, isOpen }))}
      >
        <AlertDialogContent className="border-none shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold italic uppercase tracking-tighter">Konfirmasi Peran</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Ubah peran <span className="font-black text-foreground underline decoration-primary decoration-2">{roleChangeConfirmation.userName}</span> menjadi{" "}
              <span className="font-black text-primary uppercase">
                {roleChangeConfirmation.newRole === "project_manager" ? "Manajer Proyek" : "Anggota"}
              </span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {roleChangeConfirmation.newRole === "project_manager" && (
            <div className="mt-4 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <p className="text-sm font-black text-yellow-800 dark:text-yellow-400 flex items-center gap-2 mb-2 italic">
                <ShieldAlert className="h-4 w-4" /> PERINGATAN HAK AKSES
              </p>
              <ul className="ml-5 list-disc text-xs space-y-1 font-medium text-yellow-700 dark:text-yellow-300">
                <li>Dapat mengelola tugas dan label proyek.</li>
                <li>Dapat mengundang anggota tim baru.</li>
                <li>Dapat mempromosikan anggota lain menjadi Manajer.</li>
              </ul>
            </div>
          )}
          
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="font-bold border-none" onClick={() => setRoleChangeConfirmation({ isOpen: false, userId: null, newRole: null, userName: "" })}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction className="bg-primary font-black shadow-lg shadow-primary/20" onClick={executeRoleChange}>
              Terapkan Perubahan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}