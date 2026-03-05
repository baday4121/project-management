import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Checkbox } from "@/Components/ui/checkbox";
import { FormEventHandler } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Check, LogIn, LockKeyhole } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/Components/ui/separator";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const isMobile = useIsMobile();
  const { data, setData, post, processing, errors, reset } = useForm<{
    email: string;
    password: string;
    remember: boolean;
  }>({
    email: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onFinish: () => reset("password"),
    });
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const response = await fetch(route("socialite.redirect", { provider }));
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error during social login:", error);
    }
  };

  return (
    <AuthFlowLayout>
      <Head title="Masuk ke Akun" />
      
      {status && (
        <Alert className="mb-6 border-none bg-green-500/10 text-green-600 shadow-sm" variant="success">
          <Check className="h-4 w-4" />
          <AlertTitle className="font-bold">Berhasil</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5">
        <CardHeader className="space-y-1 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Masuk</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Masukkan email dan kata sandi Anda untuk mengakses dashboard Workdei
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.com"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
                className="h-11"
              />
              <InputError message={errors.email} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                {canResetPassword && (
                  <Link
                    href={route("password.request")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
                className="h-11"
              />
              <InputError message={errors.password} />
            </div>

            <div className="flex items-center space-x-2 py-1">
              <Checkbox
                id="remember"
                checked={data.remember}
                onCheckedChange={(checked) =>
                  setData("remember", checked === true)
                }
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ingat saya di perangkat ini
              </label>
            </div>

            <div className="space-y-4 pt-2">
              <Button type="submit" className="h-11 w-full text-base font-bold shadow-lg" disabled={processing}>
                <LogIn className="mr-2 h-5 w-5" />
                Masuk Sekarang
              </Button>
              
              <div className="relative flex items-center py-2">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Atau masuk dengan
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-11"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                >
                  <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                )
                  type="button"
                  onClick={() => handleSocialLogin("github")}
                >
                  <FaGithub className="mr-2 h-4 w-4" />
                  Github
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-wrap justify-center gap-1 pb-8 text-sm text-muted-foreground">
          <span>Belum punya akun?</span>
          <Link href={route("register")} className="font-bold text-primary hover:underline">
            Daftar Gratis
          </Link>
        </CardFooter>
      </Card>
    </AuthFlowLayout>
  );
}