import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";
import { ArrowDown, Rocket, CheckCircle2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container relative mx-auto max-w-6xl overflow-x-hidden px-4 lg:overflow-visible">
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[300px] md:h-[600px] md:w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[80px] md:blur-[140px] opacity-50" />
      
      <div className="flex flex-col items-center justify-center py-16 text-center md:py-32 lg:py-48">

        <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-wider text-primary uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
          <CheckCircle2 className="h-3 md:h-3.5 w-3 md:w-3.5" />
          <span>Solusi Manajemen Proyek Terintegrasi</span>
        </div>

        <div className="space-y-4 md:space-y-8">
          <main className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            <h1 className="leading-[1.1] text-foreground">
              Kelola Proyek Lebih{" "}
              <br className="hidden sm:block" />
              <span className="relative inline-block mt-1 md:mt-2">
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic">
                  Cepat & Efisien
                </span>
                <div className="absolute -bottom-1 md:-bottom-2 left-0 h-1 md:h-1.5 w-full rounded-full bg-primary/10" />
              </span>
            </h1>
          </main>

          <p className="mx-auto max-w-[90%] md:max-w-2xl text-base leading-relaxed text-muted-foreground/80 md:text-xl font-medium">
            Optimalkan alur kerja tim Anda dengan <span className="text-foreground font-bold">WorkDei</span>. 
            Pantau tugas, kolaborasi real-time, dan capai target lebih mudah dalam satu platform terpadu.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 sm:justify-center">
          <Link href={route("register")} className="w-full sm:w-auto">
            <Button size="lg" className="group relative h-14 md:h-16 w-full sm:min-w-[220px] overflow-hidden px-8 text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Mulai Sekarang
                <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
          </Link>
          
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="h-14 md:h-16 w-full sm:min-w-[220px] px-8 text-lg font-bold hover:bg-primary/10 border border-primary/10 sm:border-transparent hover:border-primary/20 transition-all">
              <span>Pelajari Fitur</span>
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </a>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col items-center gap-4 md:gap-5">
          <div className="flex -space-x-2 md:-space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="group relative h-10 w-10 md:h-12 md:w-12 cursor-pointer rounded-full border-[3px] md:border-4 border-background bg-muted shadow-xl transition-transform hover:z-10 hover:scale-110 flex items-center justify-center overflow-hidden"
              >
                 <img 
                   src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                   alt={`User ${i}`} 
                   className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
                 />
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
            <div className="flex text-yellow-500">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p className="text-center px-4 md:px-0">
              Dipercaya oleh <span className="text-foreground font-black tracking-tight underline decoration-primary/50 decoration-2 underline-offset-4">100+</span> tim profesional
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};