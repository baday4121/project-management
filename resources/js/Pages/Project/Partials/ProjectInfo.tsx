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
  ShieldAlert,
  Mail,
  User as UserIcon,
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
import { Separator } from "@/Components/ui/separator";

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
      {/* Header Section with Image and Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {project.image_path && (
          <Card className="lg:col-span-2 overflow-hidden border-none shadow-md">
            <div className="relative h-full min-h-[250px]">
              <img
                src={project.image_path}
                alt={project.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                 <div>
                    <Badge variant={PROJECT_STATUS_BADGE_MAP(project.status)} className="mb-2 shadow-sm uppercase font-bold">
                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                    </Badge>
                    <h1 className="text-3xl font-black italic tracking-tighter">Project #{project.id}</h1>
                 </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="border-none shadow-md bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Timeline & Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Due Date</Label>
              <p className="text-lg font-black text-destructive tracking-tight">
                {project.due_date ? formatDate(project.due_date) : "No Deadline"}
              </p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src={project.createdBy.profile_picture} />
                        <AvatarFallback className="bg-primary/10 text-[10px]">{project.createdBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden text-xs">
                        <p className="font-bold text-muted-foreground uppercase text-[10px]">Creator</p>
                        <p className="truncate font-semibold">{project.createdBy.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground">
                        <Settings className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-muted-foreground uppercase text-[10px]">Updated By</p>
                        <p className="font-semibold">{project.updatedBy.name}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description Section */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-bold italic tracking-tight">
                <Info className="h-5 w-5 text-primary" /> Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description || "No description provided for this project."}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons Group */}
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <Settings className="h-4 w-4" /> Operations
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {permissions.canEditProject && (
                <>
                    <Link href={route("project.edit", project.id)} className="w-full">
                        <Button className="w-full justify-start font-bold" variant="outline">
                            <Pencil className="mr-2 h-4 w-4 text-primary" /> Edit Details
                        </Button>
                    </Link>
                    <Link href={route("project.labels.index", project.id)} className="w-full">
                        <Button className="w-full justify-start font-bold" variant="outline">
                            <Tag className="mr-2 h-4 w-4 text-primary" /> Task Labels
                        </Button>
                    </Link>
                    <Link href={route("project.statuses.index", project.id)} className="w-full">
                        <Button className="w-full justify-start font-bold" variant="outline">
                            <Settings className="mr-2 h-4 w-4 text-primary" /> Task Statuses
                        </Button>
                    </Link>
                </>
                )}
                <Link href={route("kanban.show", project.id)} className="w-full">
                    <Button className="w-full justify-start font-bold bg-primary/5 hover:bg-primary/10 text-primary border-primary/20" variant="outline">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Kanban Board
                    </Button>
                </Link>

                <Button variant="destructive" className="w-full justify-start font-bold mt-2" onClick={() => setDialogOpen(true)}>
                    {project.createdBy.id === authUser.id ? (
                        <CircleX className="mr-2 h-4 w-4" />
                    ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {project.createdBy.id === authUser.id ? "Delete Project" : "Leave Project"}
                </Button>
            </CardContent>
        </Card>
      </div>

      {/* Project Members Section */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold italic">
                <UsersRound className="h-6 w-6 text-primary" /> Team Collaborators
            </CardTitle>
            <div className="flex flex-wrap gap-2">
                {permissions.canInviteUsers && (
                    <Button variant="outline" size="sm" className="font-bold shadow-sm" onClick={onInviteClick}>
                        <UsersRound className="mr-2 h-4 w-4" /> Invite
                    </Button>
                )}
                {permissions.canInviteUsers && kickableUsers && kickableUsers.length > 0 && (
                   <Dialog open={isKickDialogOpen} onOpenChange={setKickDialogOpen}>
                   <DialogTrigger asChild>
                     <Button variant="outline" size="sm" className="font-bold text-destructive border-destructive/20 hover:bg-destructive/5">
                        <UserMinus className="mr-2 h-4 w-4" /> Kick Members
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="max-h-[80vh] overflow-y-auto border-none shadow-2xl">
                     <DialogHeader>
                       <DialogTitle className="text-xl font-bold tracking-tight">Remove Members</DialogTitle>
                       <DialogDescription>
                         Kicking users will unassign them from active tasks.
                       </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-3 py-4">
                       {kickableUsers.map((user) => (
                         <div key={user.id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id={`kick-user-${user.id}`}
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
                                <div>
                                    <p className="text-sm font-bold leading-none">{user.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{ROLE_TEXT_MAP[user.pivot?.role as keyof typeof ROLE_TEXT_MAP]}</p>
                                </div>
                            </div>
                         </div>
                       ))}
                     </div>
                     <AlertDialogFooter className="gap-2">
                       <Button variant="ghost" className="font-bold" onClick={() => setKickDialogOpen(false)}>Cancel</Button>
                       <Button variant="destructive" className="font-bold px-6" disabled={selectedUsers.length === 0} onClick={handleKickMembers}>
                         Confirm Kick
                       </Button>
                     </AlertDialogFooter>
                   </DialogContent>
                 </Dialog>
                )}
                {manageableUsers && manageableUsers.length > 0 && (
                    <Dialog open={isManageUsersDialogOpen} onOpenChange={setManageUsersDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="font-bold shadow-sm">
                        <UserCog className="mr-2 h-4 w-4" /> Manage Roles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto border-none shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight italic">Role Management</DialogTitle>
                        <DialogDescription>Adjust user access levels for this project.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {manageableUsers.map((user) => (
                          <div key={user.id} className="flex flex-col justify-between gap-4 p-4 rounded-2xl border bg-muted/5 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-primary/10">
                                    <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold tracking-tight">{user.name}</p>
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
                                <SelectItem value="project_manager" className="font-bold">Project Manager</SelectItem>
                                <SelectItem value="project_member" className="font-bold">Project Member</SelectItem>
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
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Creator Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
                    <Avatar className="h-12 w-12 border-2 border-primary ring-2 ring-background">
                        <AvatarImage src={project.createdBy.profile_picture} alt={project.createdBy.name} />
                        <AvatarFallback>{project.createdBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="font-black text-sm tracking-tight truncate uppercase italic">{project.createdBy.name}</p>
                        <Badge variant="secondary" className="text-[9px] font-black uppercase">Creator / Admin</Badge>
                    </div>
                </div>

                {/* Team Members */}
                {project.acceptedUsers?.filter((user) => user.id !== project.createdBy.id).map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl border bg-card/50 shadow-sm transition-all hover:border-primary/30 group">
                        <Avatar className="h-12 w-12 border-2 border-transparent transition-all group-hover:border-primary">
                            <AvatarImage src={user.profile_picture ? `/storage/${user.profile_picture}` : undefined} alt={user.name} />
                            <AvatarFallback className="font-bold">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm tracking-tight truncate">{user.name}</p>
                            <div className="flex items-center gap-1.5">
                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-primary/20 bg-primary/5">
                                    {user.pivot?.role === "project_manager" ? "PM" : "Member"}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      {/* ALERT DIALOGS - REFACTORED FOR BETTER UI */}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-none shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="p-4 rounded-full bg-destructive/10 text-destructive animate-pulse">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <AlertDialogTitle className="text-2xl font-black italic tracking-tighter">
                {project.createdBy.id === authUser.id ? "Delete This Project?" : "Leave Project?"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base font-medium">
                {project.createdBy.id === authUser.id
                    ? "Warning: All tasks, labels, and status history will be wiped out forever. This cannot be undone."
                    : "You will lose access to all tasks and project resources. You'll need a new invite to rejoin."}
              </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="h-12 font-bold bg-muted/50 border-none">Cancel Action</AlertDialogCancel>
            <AlertDialogAction
              className="h-12 font-black shadow-lg shadow-destructive/20 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => {
                project.createdBy.id === authUser.id ? handleDeleteProject() : handleLeaveProject();
                setDialogOpen(false);
              }}
            >
              {project.createdBy.id === authUser.id ? "CONFIRM DELETE" : "CONFIRM LEAVE"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={roleChangeConfirmation.isOpen}
        onOpenChange={(isOpen) => setRoleChangeConfirmation((prev) => ({ ...prev, isOpen }))}
      >
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 italic">
            <UserCog className="h-6 w-6 text-primary" /> Confirm Access Change
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to change <span className="font-bold text-foreground underline underline-offset-4">{roleChangeConfirmation.userName}</span>'s access to{" "}
            <span className="font-black text-primary">
                {roleChangeConfirmation.newRole === "project_manager" ? "Project Manager" : "Project Member"}
            </span>?
          </AlertDialogDescription>
          {roleChangeConfirmation.newRole === "project_manager" && (
            <div className="mt-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 text-sm">
                <p className="font-black uppercase text-[10px] tracking-widest text-primary mb-2 flex items-center gap-1">
                   <ShieldAlert className="h-3 w-3" /> Security Level: Manager
                </p>
                <ul className="space-y-1 font-bold text-primary/80">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Manage Tasks & Labels</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Invite & Manage Members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Full Project Settings Access</li>
                </ul>
            </div>
          )}
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="font-bold border-none" onClick={() => setRoleChangeConfirmation({ isOpen: false, userId: null, newRole: null, userName: "" })}>
                Go Back
            </AlertDialogCancel>
            <AlertDialogAction className="font-black shadow-lg shadow-primary/20" onClick={executeRoleChange}>
                Confirm Access Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Fixed missing Lucide Icon for the list
function CheckCircle2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
}