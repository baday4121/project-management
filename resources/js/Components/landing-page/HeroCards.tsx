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
    <div className="relative grid w-full gap-6 md:grid-cols-2 md:grid-rows-[auto_auto] lg:gap-10">
      {/* Kolom Pertama */}
      <div className="space-y-6 lg:space-y-10">
        {/* Task Management Card */}
        <Card className="group w-full border-none bg-card/60 backdrop-blur-sm shadow-xl transition-all hover:translate-y-[-4px] hover:shadow-primary/10">
          <CardHeader className="flex flex-row items-start gap-5">
            <div className="rounded-2xl bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
              <ListTodo className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Manajemen Tugas</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Kelola semua tugas tim dengan alur kerja yang lebih rapi, terukur, dan transparan setiap harinya.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Features List Card */}
        <Card className="w-full border-none bg-card/40 backdrop-blur-sm shadow-lg">
          <CardHeader className="p-8">
            <div className="space-y-6">
              {[
                {
                  icon: <Users2 className="h-5 w-5" />,
                  text: "Kolaborasi Real-time",
                  desc: "Sinkronisasi instan antar perangkat"
                },
                { 
                  icon: <Tags className="h-5 w-5" />, 
                  text: "Sistem Label Pintar",
                  desc: "Kategorikan tugas dengan mudah"
                },
                {
                  icon: <MessageSquare className="h-5 w-5" />,
                  text: "Diskusi Terpadu",
                  desc: "Komentar langsung di setiap tugas"
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{item.text}</span>
                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Kolom Kedua */}
      <div className="space-y-6 pt-0 md:pt-14 lg:space-y-10">
        {/* Developer Profile Card */}
        <Card className="relative w-full border-none bg-gradient-to-b from-card to-card/50 shadow-2xl">
          <CardHeader className="mt-10 flex items-center justify-center pb-2">
            <div className="absolute -top-12 h-28 w-28 overflow-hidden rounded-full border-[6px] border-background shadow-2xl">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZnF8ElwCzCgHGTNVnaElToLnw3zE4AgEVQ&s"
                alt="Developer Avatar"
                className="h-full w-full object-cover transition-transform hover:scale-110 duration-500"
              />
            </div>
            <CardTitle className="mt-6 flex items-center gap-2 text-3xl font-black tracking-tighter">
              Ari Gunawan
              <a
                rel="noreferrer noopener"
                href="https://github.com/baday4121"
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "h-9 w-9 rounded-full hover:bg-primary/20 transition-colors"
                })}
              >
                <GitHubLogoIcon className="h-6 w-6" />
              </a>
            </CardTitle>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary border border-primary/10">
              <Sparkles className="h-3.5 w-3.5" />
              Fullstack Developer
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10 text-center text-lg font-medium italic leading-relaxed text-muted-foreground">
            <span className="text-primary font-bold text-2xl leading-none">“</span>
            Workdei dirancang untuk menyederhanakan cara tim berkolaborasi, memastikan setiap proyek selesai tepat waktu dengan hasil maksimal.
            <span className="text-primary font-bold text-2xl leading-none">”</span>
          </CardContent>
        </Card>

        {/* Desktop Collaboration Card */}
        <div className="hidden md:block">
          <Card className="group w-full border-none bg-primary text-primary-foreground shadow-2xl transition-all hover:translate-y-[-4px]">
            <CardHeader className="flex flex-row items-center gap-5 p-8">
              <div className="rounded-2xl bg-white/20 p-4">
                <Users2 className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Tim Tanpa Batas</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-base">
                  Terhubung dengan seluruh tim dan kelola proyek bersama secara real-time dari mana saja.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Dekorasi Cahaya di Belakang */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[150px] animate-pulse" />
    </div>
  );
};