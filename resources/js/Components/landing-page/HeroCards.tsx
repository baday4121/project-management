import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ListTodo, MessageSquare, Tags, Users2, Sparkles } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const HeroCards = () => {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2 md:grid-rows-[auto_auto] lg:gap-8">
      {/* Kolom Pertama */}
      <div className="space-y-6 lg:space-y-8">
        {/* Task Management Card */}
        <Card className="w-full border-none shadow-black/5 drop-shadow-2xl dark:shadow-white/5 transition-all hover:scale-[1.02]">
          <CardHeader className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Manajemen Tugas</CardTitle>
              <CardDescription className="mt-2 text-base">
                Kelola semua tugas tim dengan alur kerja yang lebih rapi dan terukur setiap harinya.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Features List Card */}
        <Card className="w-full border-none shadow-black/5 drop-shadow-2xl dark:shadow-white/5">
          <CardHeader>
            <div className="space-y-5">
              {[
                {
                  icon: <Users2 className="h-5 w-5" />,
                  text: "Kolaborasi Real-time",
                },
                { 
                  icon: <Tags className="h-5 w-5" />, 
                  text: "Sistem Label Pintar" 
                },
                {
                  icon: <MessageSquare className="h-5 w-5" />,
                  text: "Diskusi Tugas Terpadu",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 font-medium">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Kolom Kedua */}
      <div className="space-y-6 pt-10 lg:space-y-8">
        {/* Developer Profile Card */}
        <Card className="relative w-full border-none shadow-black/5 drop-shadow-2xl dark:shadow-white/5">
          <CardHeader className="mt-8 flex items-center justify-center pb-2">
            <div className="absolute -top-12 h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-xl">
               <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZnF8ElwCzCgHGTNVnaElToLnw3zE4AgEVQ&s"
                alt="Developer Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <CardTitle className="mt-4 flex items-center gap-2 text-2xl font-bold">
              Baday.
              <a
                rel="noreferrer noopener"
                href="https://github.com/baday4121"
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 rounded-full"
                })}
              >
                <GitHubLogoIcon className="h-5 w-5" />
              </a>
            </CardTitle>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              Developer
            </div>
          </CardHeader>
          <CardContent className="pb-8 text-center text-lg leading-relaxed text-muted-foreground italic">
            "Workdei dirancang untuk mengubah cara tim pengembang dalam berkolaborasi dan menyelesaikan proyek."
          </CardContent>
        </Card>

        {/* Desktop Collaboration Card */}
        <div className="hidden md:block">
          <Card className="w-full border-none shadow-black/5 drop-shadow-2xl dark:shadow-white/5 transition-all hover:scale-[1.02]">
            <CardHeader className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Kolaborasi Tim</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Terhubung dengan seluruh anggota tim dan kelola proyek bersama secara real-time.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Dekorasi Cahaya di Belakang */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
    </div>
  );
};