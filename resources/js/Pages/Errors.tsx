import { Head, Link } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Home, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/Components/ui/button";

const statusMessages: { [key: number]: { title: string; message: string } } = {
  400: {
    title: "400 - Permintaan Salah",
    message: "Maaf, permintaan tidak dapat dipahami oleh server.",
  },
  401: {
    title: "401 - Tidak Terautentikasi",
    message: "Maaf, Anda harus login terlebih dahulu untuk mengakses halaman ini.",
  },
  403: {
    title: "403 - Akses Ditolak",
    message: "Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.",
  },
  404: {
    title: "404 - Halaman Tidak Ditemukan",
    message: "Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.",
  },
  405: {
    title: "405 - Metode Tidak Diizinkan",
    message: "Maaf, metode permintaan tidak diizinkan untuk halaman ini.",
  },
  419: {
    title: "419 - Sesi Kedaluwarsa",
    message: "Maaf, sesi Anda telah berakhir. Silakan segarkan halaman dan coba lagi.",
  },
  429: {
    title: "429 - Terlalu Banyak Permintaan",
    message: "Maaf, Anda melakukan terlalu banyak permintaan dalam waktu singkat.",
  },
  500: {
    title: "500 - Kesalahan Server",
    message: "Maaf, terjadi kesalahan internal pada sistem kami. Kami akan segera memperbaikinya.",
  },
  503: {
    title: "503 - Layanan Tidak Tersedia",
    message: "Maaf, saat ini layanan sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.",
  },
};

export default function Errors({ status }: { status: number }) {
  const { title, message } = statusMessages[status] || {
    title: "Error Tidak Dikenal",
    message: "Terjadi kesalahan yang tidak terduga.",
  };

  return (
    <>
      <Head title={title} />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
        {/* Dekorasi Background */}
        <div className="absolute -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
        
        <Card className="w-full max-w-md border-none shadow-2xl transition-all duration-300 hover:shadow-primary/5">
          <CardHeader className="flex flex-col items-center pt-10">
            <div className="mb-6 rounded-2xl bg-primary/10 p-4 transition-transform hover:rotate-12">
               <ApplicationLogo className="h-12 w-12 fill-primary" />
            </div>
            <CardTitle className="text-6xl font-black tracking-tighter text-primary/20">
              {status}
            </CardTitle>
            <h2 className="mt-2 text-xl font-bold text-foreground">{title}</h2>
          </CardHeader>
          
          <CardContent className="px-10 pb-8 text-center">
            <p className="text-base leading-relaxed text-muted-foreground">
              {message}
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 p-6">
            <Link href="/" className="w-full">
              <Button className="w-full gap-2 text-base font-semibold shadow-md">
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
            
            {status === 419 ? (
               <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.location.reload()}
               >
                <RefreshCw className="h-4 w-4" />
                Segarkan Halaman
               </Button>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <ShieldAlert className="h-3 w-3" />
                WorkDei Protection System
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}