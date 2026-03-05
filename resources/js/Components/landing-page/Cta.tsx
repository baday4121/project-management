import { Link } from "@inertiajs/react";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Cta = () => {
  return (
    <section id="cta" className="relative my-24 overflow-hidden py-16 sm:my-32">
      {/* Background Decorator */}
      <div className="absolute inset-0 -z-10 bg-primary/5 dark:bg-primary/10" />
      <div className="absolute -left-24 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Siap untuk memulai?</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Kelola Proyek Anda{" "}
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Lebih Baik Hari Ini
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Bergabunglah dengan ratusan tim yang telah menggunakan WorkDei untuk 
              menyederhanakan alur kerja, meningkatkan kolaborasi, dan mencapai target 
              lebih cepat. Gratis selamanya!
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center lg:w-auto">
            <Link href={route("register")}>
              <Button size="lg" className="group h-14 w-full px-10 text-lg font-bold sm:w-auto">
                <span>Daftar Sekarang</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="h-14 w-full px-10 text-lg sm:w-auto">
                Pelajari Fitur
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};