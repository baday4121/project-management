import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";
import { HeroCards } from "./HeroCards";
import { ArrowDown, Rocket } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container relative mx-auto max-w-7xl overflow-hidden px-4">
      {/* Background Decorative Glow */}
      <div className="absolute -top-[10%] left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] lg:-top-[20%]" />
      
      <div className="grid items-center gap-16 py-24 md:py-36 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col space-y-8 text-center lg:text-start">
          <main className="text-5xl font-extrabold tracking-tight md:text-6xl">
            <h1 className="leading-tight">
              Kelola Proyek Lebih{" "}
              <span className="block bg-gradient-to-r from-primary via-primary-light to-primary-dark bg-clip-text text-transparent">
                Cepat & Efisien
              </span>
            </h1>
          </main>

          <p className="mx-auto text-xl leading-relaxed text-muted-foreground md:w-11/12 lg:mx-0">
            Optimalkan alur kerja tim Anda dengan solusi manajemen proyek Nexicon. 
            Pantau tugas, kolaborasi real-time, dan capai target lebih mudah dalam satu platform terpadu.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link href={route("register")}>
              <Button size="lg" className="group h-14 w-full px-8 text-lg font-semibold sm:w-auto">
                <span>Mulai Sekarang</span>
                <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <a href="#features">
              <Button variant="ghost" size="lg" className="h-14 w-full px-8 text-lg sm:w-auto">
                <span>Pelajari Fitur</span>
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
              ))}
            </div>
            <p>Dipercaya oleh 100+ tim profesional</p>
          </div>
        </div>

        <div className="relative z-0 flex justify-center lg:justify-end">
          <div className="absolute -right-10 top-1/2 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-[80px]" />
          <HeroCards />
        </div>
      </div>
    </section>
  );
};