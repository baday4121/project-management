import { Head, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/Components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ShieldCheck, LockKeyhole } from "lucide-react";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
import React from "react";

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: "",
  });

  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.confirm"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Konfirmasi Kata Sandi" />

      <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Area Amankan</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Ini adalah area aman. Harap konfirmasi kata sandi Anda sebelum melanjutkan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">Kata Sandi</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Masukkan kata sandi Anda"
                  className="h-11 pl-10 focus:ring-primary/20 shadow-sm"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  autoFocus
                  required
                />
              </div>
              
              <Accordion
                type="single"
                collapsible
                value={data.password.length > 0 ? "password-meter" : ""}
                className="w-full"
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

            <Button 
              type="submit" 
              className="h-11 w-full font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
              disabled={processing || !isPasswordValid}
            >
              {processing ? "Memverifikasi..." : "KONFIRMASI SEKARANG"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthFlowLayout>
  );
}