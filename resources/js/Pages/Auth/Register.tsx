import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Separator } from "@/Components/ui/separator";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/Components/ui/accordion";
import React from "react";

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
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
      <Head title="Daftar Akun Baru" />
      
      <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5">
        <CardHeader className="space-y-1 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Daftar Akun</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Lengkapi data di bawah untuk mulai menggunakan Workdei
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            {/* Input Nama */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Masukkan nama Anda"
                  className="pl-10 h-11"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                />
              </div>
              <InputError message={errors.name} />
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10 h-11"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  required
                />
              </div>
              <InputError message={errors.email} />
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Buat kata sandi kuat"
                  className="pl-10 h-11"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  required
                />
              </div>
              
              <Accordion
                type="single"
                collapsible
                value={data.password.length > 0 ? "password-meter" : ""}
              >
                <AccordionItem value="password-meter" className="border-none">
                  <AccordionContent className="pb-0 pt-2">
                    <PasswordStrengthMeter
                      password={data.password}
                      onValidationChange={setIsPasswordValid}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <InputError message={errors.password} />
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  className="pl-10 h-11"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  required
                />
              </div>
              <InputError message={errors.password_confirmation} />
            </div>

            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                className="h-11 w-full text-base font-bold shadow-lg shadow-primary/20"
                disabled={processing || !isPasswordValid || !data.password_confirmation}
              >
                <span>Daftar Sekarang</span>
              </Button>

              <div className="flex justify-center text-sm">
                <span className="text-muted-foreground">Sudah punya akun?</span>
                <Link
                  href={route("login")}
                  className="ml-1 font-bold text-primary hover:underline"
                >
                  Masuk di sini
                </Link>
              </div>

              <div className="relative flex items-center py-2">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Atau daftar dengan
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-11 font-medium"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                >
                  <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-11 font-medium"
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
      </Card>
    </AuthFlowLayout>
  );
}