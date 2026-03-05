import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";

type Props = {
  success?: string;
};

export default function Create({ success }: Props) {
  const { data, setData, post, errors, reset, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post(route("user.store"), {
      preserveState: true,
      onSuccess: () => {
        reset();
        toast({
          title: "Berhasil",
          description: "Pengguna baru telah berhasil ditambahkan ke sistem.",
          variant: "success",
        });
      },
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Gagal menambahkan pengguna",
          variant: "destructive",
          description: errorMessage,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
              Tambah Pengguna Baru
            </h2>
          </div>
          <Link href={route("user.index")}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <Head title="Tambah Pengguna" />

      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5">
            <CardHeader className="space-y-1 border-b bg-muted/20 pb-6">
              <CardTitle className="text-2xl font-black">Data Akun</CardTitle>
              <CardDescription>
                Silakan isi informasi identitas dan kredensial untuk pengguna baru.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-6">
                
                {/* Nama Pengguna */}
                <div className="space-y-2">
                  <Label htmlFor="user_name" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <UserIcon className="h-3 w-3" /> Nama Lengkap
                  </Label>
                  <Input
                    id="user_name"
                    type="text"
                    placeholder="Masukkan nama lengkap..."
                    className="h-11 shadow-sm focus:ring-primary/20"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoFocus
                  />
                  <InputError message={errors.name} />
                </div>

                {/* Email Pengguna */}
                <div className="space-y-2">
                  <Label htmlFor="user_email" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                    <Mail className="h-3 w-3" /> Alamat Email
                  </Label>
                  <Input
                    id="user_email"
                    type="email"
                    placeholder="nama@perusahaan.com"
                    className="h-11 shadow-sm focus:ring-primary/20"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="user_password" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <Lock className="h-3 w-3" /> Kata Sandi
                    </Label>
                    <Input
                      id="user_password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 shadow-sm focus:ring-primary/20"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      required
                    />
                    <InputError message={errors.password} />
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="space-y-2">
                    <Label htmlFor="user_password_confirmation" className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                      <Lock className="h-3 w-3" /> Konfirmasi Sandi
                    </Label>
                    <Input
                      id="user_password_confirmation"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 shadow-sm focus:ring-primary/20"
                      value={data.password_confirmation}
                      onChange={(e) => setData("password_confirmation", e.target.value)}
                      required
                    />
                    <InputError message={errors.password_confirmation} />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-3 border-t pt-8">
                  <Link href={route("user.index")}>
                    <Button type="button" variant="ghost" className="font-semibold">
                      Batal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    disabled={processing}
                  >
                    {processing ? "Memproses..." : "Simpan Pengguna"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}