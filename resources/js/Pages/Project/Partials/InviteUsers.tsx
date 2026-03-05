import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { AlertCircle, Info, Search, UsersRound, X, Check, Mail, UserPlus } from "lucide-react";
import InputError from "@/Components/InputError";
import { User } from "@/types/user";
import { Project } from "@/types/project";
import { PageProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import _ from "lodash";

type Props = {
  project: Project;
  serverError: string | null;
};

export default function InviteUsers({ project, serverError }: Props) {
  const user = usePage<PageProps>().props.auth.user;
  const [isInviteFormVisible, setInviteFormVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(serverError);
  
  const { data, setData, post, reset, errors, processing } = useForm({
    email: "",
    currentUserEmail: user.email,
  });

  const toggleInviteForm = () => {
    setInviteFormVisible(!isInviteFormVisible);
    setSearchResults([]);
    setSelectedUser(null);
    setError(null);
    reset("email");
  };

  const searchUsers = async () => {
    if (!data.email) return;
    setSelectedUser(null);

    try {
      const response = await fetch(
        route("user.search", { project: project.id }) + `?email=${data.email}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "same-origin",
        },
      );

      const result = await response.json();
      setSearchResults([]);

      if (response.ok && result.users?.length > 0) {
        setSearchResults(result.users);
        setError(null);
        return;
      }

      switch (response.status) {
        case 422: setError(result.error || "Format email tidak valid."); break;
        case 409: setError(result.error || "Pengguna sudah diundang ke proyek ini."); break;
        case 404: setError(result.error || "Pengguna tidak ditemukan."); break;
        default: setError(result.error || "Terjadi kesalahan saat mencari.");
      }
    } catch (err) {
      setError("Gagal menghubungi server pencarian.");
      setSearchResults([]);
    }
  };

  const debouncedSearch = useCallback(_.debounce(searchUsers, 500), [data.email]);

  useEffect(() => {
    if (data.email && data.email.includes('@')) {
      debouncedSearch();
    }
    return () => debouncedSearch.cancel();
  }, [data.email, debouncedSearch]);

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setSearchResults([]);
    setError(null);
  };

  const submitInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    post(route("project.invite", { project: project.id }), {
      onSuccess: () => {
        toggleInviteForm();
      },
      onError: (err) => {
        setError(err.email || "Gagal mengirim undangan.");
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Undang Anggota Tim</h2>
      </header>

      {/* Info Box */}
      <div className="rounded-xl border bg-primary/5 p-5 dark:bg-primary/10 border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-primary" />
          <h4 className="font-bold text-sm uppercase tracking-wider">Ketentuan Undangan</h4>
        </div>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>Cari anggota tim menggunakan alamat email yang terdaftar.</li>
          <li>Pengguna yang diundang akan menerima notifikasi untuk menerima atau menolak.</li>
          <li>Anda dapat mengirim ulang undangan jika sebelumnya ditolak.</li>
        </ul>
      </div>

      {!isInviteFormVisible ? (
        <Button 
          size="lg" 
          className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105" 
          onClick={toggleInviteForm}
        >
          <Search className="mr-2 h-4 w-4" />
          Cari Pengguna
        </Button>
      ) : (
        <form onSubmit={submitInvite} className="space-y-6 p-1">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Masukkan email rekan tim Anda..."
                className="h-11 pl-10 focus:ring-primary/20 shadow-sm"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                autoFocus
                required
              />
            </div>
            <InputError message={errors.email} />
          </div>

          {error && (
            <Alert variant="destructive" className="border-none bg-destructive/10 text-destructive shadow-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">Perhatian</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search Results Dropdown-style */}
          {searchResults.length > 0 && (
            <div className="overflow-hidden rounded-xl border bg-card shadow-xl animate-in zoom-in-95 duration-200">
              <div className="bg-muted/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Hasil Pencarian
              </div>
              <ul className="divide-y border-t">
                {searchResults.map((u) => (
                  <li
                    key={u.id}
                    onClick={() => selectUser(u)}
                    className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-primary/5"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.profile_picture ? `/storage/${u.profile_picture}` : undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden text-sm">
                      <p className="font-bold truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selected User Preview */}
          {selectedUser && (
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                   <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-tighter">Siap Diundang:</p>
                  <p className="font-bold text-lg leading-none">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 font-black shadow-lg shadow-primary/20 h-11" 
              disabled={!selectedUser || processing}
            >
              <UsersRound className="mr-2 h-4 w-4" />
              {processing ? "Mengirim..." : "Kirim Undangan"}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="h-11 font-bold"
              onClick={toggleInviteForm}
            >
              <X className="mr-2 h-4 w-4" />
              Batalkan
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}