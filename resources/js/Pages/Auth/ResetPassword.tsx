import { Head, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import { KeyRound, Mail, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/Components/ui/accordion";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
import React from "react";

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Atur Ulang Kata Sandi" />

      <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <KeyRound className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Atur Ulang Sandi</CardTitle>
          <CardDescription className="text-base">
            Buat kata sandi baru yang kuat untuk mengamankan akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            {/* Email Field (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                <Input 
                  id="email" 
                  type="email" 
                  value={data.email} 
                  disabled 
                  className="h-11 pl-10 bg-muted/50 cursor-not-allowed border-dashed"
                />
              </div>
              <InputError message={errors.email} />
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">Kata Sandi Baru</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan sandi baru"
                  className="h-11 pl-10 focus:ring-primary/20"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <Accordion
                type="single"
                collapsible
                value={data.password.length > 0 ? "meter" : ""}
                className="w-full"
              >
                <AccordionItem value="meter" className="border-none">
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

            {/* Password Confirmation */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="font-bold">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="Ulangi sandi baru"
                  className="h-11 pl-10 focus:ring-primary/20"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  required
                />
              </div>
              <InputError message={errors.password_confirmation} />
            </div>

            <Button
              type="submit"
              className="h-11 w-full font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
              disabled={
                processing || !isPasswordValid || !data.password_confirmation
              }
            >
              {processing ? "Menyimpan..." : "PERBARUI KATA SANDI"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthFlowLayout>
  );
}