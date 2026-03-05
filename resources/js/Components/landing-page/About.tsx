import { ClipboardList, Target, Zap } from "lucide-react";
import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section id="about" className="container mx-auto max-w-7xl px-4 py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-muted/50 to-background p-8 md:p-16">
        {/* Background Aura */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          {/* Visual Side */}
          <div className="relative flex items-center justify-center lg:w-1/3">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl bg-primary/10 shadow-inner lg:h-56 lg:w-56">
                <ClipboardList className="h-20 w-20 text-primary lg:h-28 lg:w-28" />
              </div>
              
              {/* Floating Element 1 */}
              <div className="absolute -right-4 -top-4 rounded-xl border bg-background p-3 shadow-lg animate-bounce duration-[3000ms]">
                <Target className="h-6 w-6 text-primary" />
              </div>
              
              {/* Floating Element 2 */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border bg-background p-3 shadow-lg animate-pulse">
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Text Content Side */}
          <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                Revolusi Cara Tim Anda{" "}
                <span className="block bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Mengelola Proyek
                </span>
              </h2>
              <p className="mx-auto text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0">
                Workdei menghadirkan semua kebutuhan tim Anda dalam satu ekosistem digital. 
                Mulai dari pemantauan tugas hingga kolaborasi real-time, platform intuitif kami 
                membantu tim tetap terorganisir, fokus, dan produktif dengan fitur yang dirancang 
                khusus untuk efisiensi maksimal.
              </p>
            </div>

            <div className="mt-16 rounded-2xl bg-background/50 p-8 backdrop-blur-sm border border-primary/5">
              <Statistics />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};