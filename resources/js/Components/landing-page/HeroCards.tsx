import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ListTodo, MessageSquare, Tags, Users2, Sparkles, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const HeroCards = () => {
  return (
    <div className="relative grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 lg:gap-8">
      
      {/* Kolom 1: Fitur Utama */}
      <div className="flex flex-col gap-6">
        {/* Task Management Card */}
        <Card className="group relative overflow-hidden border-none bg-background/60 shadow-2xl backdrop-blur-sm transition-all hover:bg-background/80 lg:p-2">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="mt-1 rounded-xl bg-primary/10 p-2.5 text-primary shadow-inner">
              <ListTodo className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold tracking-tight">Manajemen Tugas</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Kelola semua tugas tim dengan alur kerja yang lebih rapi dan terukur setiap harinya.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Feature Check-list Card */}
        <Card className="border-none bg-background/60 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-4">
            {[
              { icon: <Users2 className="h-4 w-4" />, text: "Kolaborasi Real-time", color: "text-blue-500" },
              { icon: <Tags className="h-4 w-4" />, text: "Sistem Label Pintar", color: "text-emerald-500" },
              { icon: <MessageSquare className="h-4 w-4" />, text: "Diskusi Terpadu", color: "text-amber-500" },
            ].map((item, i) => (
              <div key={i} className="group flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/10`}>
                  {item.icon}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground lg:text-base">{item.text}</span>
                  <CheckCircle2 className="h-4 w-4 text-primary/40 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </CardHeader>
        </Card>
      </div>

      {/* Kolom 2: Profil & Extra Info */}
      <div className="flex flex-col gap-6 md:mt-12 lg:mt-16">
        {/* Developer Profile Card */}
        <Card className="relative overflow-visible border-none bg-background/60 shadow-2xl backdrop-blur-sm transition-all hover:shadow-primary/5">
          <CardHeader className="flex flex-col items-center pb-4 pt-12">
            <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/50 p-1 shadow-2xl">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-background">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZnF8ElwCzCgHGTNVnaElToLnw3zE4AgEVQ&s"
                  alt="Developer Avatar"
                  className="h-full w-full object-cover transition-transform hover:scale-110"
                />
              </div>
            </div>
            
            <div className="mt-2 space-y-1 text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl font-black italic tracking-tighter">
                baday.
                <a
                  href="https://github.com/baday4121"
                  target="_blank"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 rounded-full hover:bg-primary/20",
                  })}
                >
                  <GitHubLogoIcon className="h-4 w-4" />
                </a>
              </CardTitle>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                <Sparkles className="h-3 w-3" />
                Lead Developer
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <p className="text-sm font-medium italic leading-relaxed text-muted-foreground lg:text-base">
              "Workdei dirancang untuk mengubah cara tim pengembang berkolaborasi dan menyelesaikan proyek."
            </p>
          </CardContent>
        </Card>

        {/* Mobile-Friendly Collaboration Card */}
        <Card className="group border-none bg-primary/5 shadow-2xl backdrop-blur-sm transition-all hover:bg-primary/10">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4 lg:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/50 text-primary shadow-sm group-hover:rotate-6 transition-transform">
              <Users2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Kolaborasi Tim</CardTitle>
              <CardDescription className="text-xs leading-snug lg:text-sm">
                Terhubung dan kelola proyek bersama secara real-time.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Dekorasi Cahaya Dinamis */}
      <div className="absolute -left-[10%] top-[20%] -z-10 h-64 w-64 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
      <div className="absolute -right-[10%] bottom-[10%] -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
    </div>
  );
};