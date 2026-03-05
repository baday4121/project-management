import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";
import { ArrowDown, Rocket } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container relative mx-auto max-w-5xl overflow-hidden px-4">
      {/* Efek Cahaya Dekoratif Latar Belakang */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      
      {/* Layout Rata Tengah (Centered) */}
      <div className="flex flex-col items-center justify-center py-24 text-center md:py-40">
        
        {/* Judul Utama */}
        <div className="space-y-6">
          <main className="text-5xl font-black tracking-tighter md:text-7xl">
            <h1 className="leading-[1.1]">
              Kelola Proyek Lebih{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic">
                Cepat & Efisien
              </span>
            </h1>
          </main>

          {/* Deskripsi */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Optimalkan alur kerja tim Anda dengan solusi manajemen proyek **WorkDei**. 
            Pantau tugas, kolaborasi real-time, dan capai target lebih mudah dalam satu platform terpadu.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href={route("register")}>
            <Button size="lg" className="group h-14 min-w-[200px] px-8 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <span>Mulai Sekarang</span>
              <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <a href="#features">
            <Button variant="ghost" size="lg" className="h-14 min-w-[200px] px-8 text-lg font-medium hover:bg-primary/5">
              <span>Pelajari Fitur</span>
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </a>
        </div>

        {/* Bukti Sosial (Social Proof) */}
        <div className="mt-16 flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-10 w-10 rounded-full border-2 border-background bg-muted shadow-sm flex items-center justify-center text-[10px] font-bold"
              >
                Tim {i}
              </div>
            ))}
          </div>
          <p className="font-medium tracking-wide">Dipercaya oleh <span className="text-primary font-bold">100+</span> tim profesional</p>
        </div>
      </div>
    </section>
  );
};