import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormEventHandler } from "react";
import { Mail, LogOut, Send, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});
  const { toast } = useToast();

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("verification.send"), {
      onFinish: () => {
        toast({
          title: "Email Terkirim",
          variant: "success",
          description: "Tautan verifikasi baru telah dikirim ke alamat email Anda.",
          duration: 5000,
        });
      },
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Verifikasi Email" />

      <Card className="border-none shadow-2xl shadow-black/5 dark:shadow-white/5 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Mail className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Verifikasi Email</CardTitle>
          <CardDescription className="text-base">
            Terima kasih telah mendaftar! Satu langkah lagi untuk memulai.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground text-center">
              Kami telah mengirimkan tautan verifikasi ke alamat email Anda. 
              Harap periksa kotak masuk (atau folder spam) Anda untuk mengaktifkan akun.
            </p>
          </div>

          {status === "verification-link-sent" && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in zoom-in-95">
              <CheckCircle2 className="h-4 w-4" />
              Tautan baru telah berhasil dikirim!
            </div>
          )}

          <form onSubmit={submit}>
            <Button 
              type="submit" 
              className="h-11 w-full font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
              disabled={processing}
            >
              <Send className="mr-2 h-4 w-4" />
              {processing ? "Mengirim ulang..." : "Kirim Ulang Email Verifikasi"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 border-t bg-muted/30 py-6">
          <p className="text-xs text-muted-foreground">Salah memasukkan email atau ingin keluar?</p>
          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="flex items-center gap-2 text-sm font-bold text-destructive hover:opacity-80 transition-opacity"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </Link>
        </CardFooter>
      </Card>
    </AuthFlowLayout>
  );
}