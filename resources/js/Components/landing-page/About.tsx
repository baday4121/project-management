import { ClipboardList, Target, Zap } from "lucide-react";
import { Statistics } from "./Statistics";
import { cn } from "@/lib/utils";

export const About = () => {
  return (
    <section id="about" className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-gradient-to-br from-muted/30 via-background to-background p-8 md:p-16 lg:p-20 shadow-2xl shadow-primary/5">
        
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px] opacity-50" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px] opacity-30" />
        
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          
          <div className="relative flex items-center justify-center lg:w-1/3">
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-primary/20 blur-3xl animate-pulse" />
              
              <div className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 shadow-inner md:h-60 md:w-60">
                <ClipboardList className="h-24 w-24 text-primary md:h-32 md:w-32" />
              </div>
              
              <div className="absolute -right-2 -top-2 md:-right-6 md:-top-6 rounded-2xl border border-primary/20 bg-card p-4 shadow-xl animate-bounce duration-[4000ms]">
                <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              
              <div className="absolute -bottom-2 -left-2 md:-bottom-6 md:-left-6 rounded-2xl border border-yellow-500/20 bg-card p-4 shadow-xl animate-pulse">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
            <div className="space-y-6">
              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Revolusi Cara Tim Anda{" "}
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic">
                  Mengelola Proyek
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0">
                WorkDei menghadirkan ekosistem digital terpadu untuk efisiensi maksimal. 
                Dari pemantauan tugas hingga kolaborasi real-time, setiap fitur dirancang untuk memastikan 
                tim **Nexicon** tetap terorganisir dan produktif.
              </p>
            </div>

            <div className="mt-12 w-full rounded-3xl bg-background/40 p-2 md:p-6 backdrop-blur-md border border-primary/10">
              <Statistics isCompact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};