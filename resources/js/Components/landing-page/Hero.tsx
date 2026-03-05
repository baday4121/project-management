import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";
import { ArrowDown, Rocket, CheckCircle2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container relative mx-auto max-w-6xl overflow-hidden px-4">
      {/* Efek Background Glow yang lebih dramatis */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] opacity-50" />
      
      <div className="flex flex-col items-center justify-center py-28 text-center md:py-48">
        
        {/* Badge Mini (Opsional tapi keren) */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-wider text-primary uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Solusi Manajemen Proyek Terintegrasi</span>
        </div>

        {/* Judul Utama dengan Tipografi yang lebih kuat */}
        <div className="space-y-8">
          <main className="text-6xl font-black tracking-tight md:text-8xl">
            <h1 className="leading-[1.05] text-foreground">
              Kelola Proyek Lebih{" "}
              <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic tracking-tighter">
                  Cepat & Efisien
                </span>
                {/* Garis bawah dekoratif halus */}
                <div className="absolute -bottom-2 left-0 h-1.5 w-full rounded-full bg-primary/10" />
              </span>
            </h1>
          </main>

          {/* Deskripsi dengan keterbacaan lebih tinggi */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground/80 md:text-xl font-medium">
            Optimalkan alur kerja tim Anda dengan <span className="text-foreground font-bold">WorkDei</span>. 
            Pantau tugas, kolaborasi real-time, dan capai target lebih mudah dalam satu platform terpadu yang didesain untuk kecepatan.
          </p>
        </div>

        {/* Tombol Aksi dengan Glow Effect */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href={route("register")}>
            <Button size="lg" className="group relative h-16 min-w-[220px] overflow-hidden px-8 text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Mulai Sekarang
                <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
              {/* Efek kilauan pada tombol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
          </Link>
          
          <a href="#features">
            <Button variant="ghost" size="lg" className="h-16 min-w-[220px] px-8 text-lg font-bold hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all">
              <span>Pelajari Fitur</span>
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </a>
        </div>

        {/* Bukti Sosial dengan Avatar yang lebih bersih */}
        <div className="mt-20 flex flex-col items-center gap-5">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="group relative h-12 w-12 cursor-pointer rounded-full border-4 border-background bg-muted shadow-xl transition-transform hover:z-10 hover:scale-110 flex items-center justify-center overflow-hidden"
              >
                 <img 
                   src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                   alt={`User ${i}`} 
                   className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
                 />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="flex text-yellow-500">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p>Dipercaya oleh <span className="text-foreground font-black tracking-tight underline decoration-primary/50 decoration-2 underline-offset-4">100+</span> tim profesional</p>
          </div>
        </div>
      </div>
    </section>
  );
};