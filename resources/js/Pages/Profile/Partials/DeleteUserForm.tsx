import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteUserForm({ className = "" }: { className?: string }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: "",
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
      },
      onError: () => {
        passwordInput.current?.focus();
        toast({
          title: "Gagal",
          variant: "destructive",
          description: "Gagal menghapus akun. Silakan periksa kembali kata sandi Anda.",
        });
      },
      onFinish: () => {
        reset();
      },
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    clearErrors();
    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header className="flex items-start gap-4">
        <div className="rounded-full bg-destructive/10 p-3">
          <Trash2 className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Hapus Akun
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Setelah akun Anda dihapus, semua sumber daya dan data di dalamnya akan dihapus secara permanen. 
            Sebelum melanjutkan, harap unduh data atau informasi apa pun yang ingin Anda simpan.
          </p>
        </div>
      </header>

      <Button variant="destructive" onClick={confirmUserDeletion} className="px-6 font-bold shadow-lg shadow-destructive/20 transition-all hover:scale-105">
        Hapus Akun Permanen
      </Button>

      <AlertDialog
        open={confirmingUserDeletion}
        onOpenChange={setConfirmingUserDeletion}
      >
        <AlertDialogContent className="max-w-md border-none shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-4 animate-bounce">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
              Apakah Anda yakin?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Semua data Anda di **Workdei** akan hilang selamanya. 
              Silakan masukkan kata sandi Anda untuk konfirmasi akhir.
            </AlertDialogDescription>
          </div>

          <form onSubmit={deleteUser} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password_delete" className="font-bold">Kata Sandi Konfirmasi</Label>
              <Input
                id="password_delete"
                type="password"
                name="password"
                ref={passwordInput}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="h-11 focus:ring-destructive/20"
                placeholder="Masukkan kata sandi Anda"
              />
              <InputError message={errors.password} />
            </div>

            <AlertDialogFooter className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AlertDialogCancel 
                onClick={closeModal} 
                className="h-11 border-none bg-muted/50 hover:bg-muted font-bold"
              >
                Batalkan
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  className="h-11 px-8 font-black shadow-lg shadow-destructive/20"
                  disabled={processing}
                  onClick={deleteUser}
                >
                  {processing ? "Menghapus..." : "Ya, Hapus Akun Saya"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}