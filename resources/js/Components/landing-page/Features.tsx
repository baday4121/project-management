import { JSX } from "react/jsx-runtime";
import { 
  ClipboardList, 
  Users2, 
  Tags, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  CloudIcon, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
  className?: string;
}

export const Features = () => {
  return (
    <section id="features" className="container mx-auto max-w-7xl px-4 py-24 sm:py-32">
      {/* Header dengan gaya Minimalis & Sharp */}
      <div className="mb-20 flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Zap className="h-3.5 w-3.5 fill-current" />
          Kekuatan Inti WorkDei
        </div>
        <h2 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
          Satu Platform. <br />
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic">
            Tanpa Batas Produktivitas.
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-medium text-muted-foreground/80">
          Lupakan kerumitan beralih antar aplikasi. WorkDei menyatukan semua yang tim Nexicon butuhkan dalam satu ekosistem yang kohesif.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-full">
        
        {/* Feature 1: Big Card (Span 3) */}
        <FeatureCard 
          className="md:col-span-3 md:row-span-1 bg-gradient-to-br from-primary/10 via-background to-background"
          icon={<ClipboardList className="h-8 w-8 text-primary" />}
          title="Manajemen Tugas Pro"
          description="Sistem manajemen tugas intuitif untuk memantau progres proyek Nexicon secara real-time dari awal hingga rilis."
        />

        {/* Feature 2: Small Card (Span 3) */}
        <FeatureCard 
          className="md:col-span-3 md:row-span-1"
          icon={<Users2 className="h-8 w-8 text-blue-400" />}
          title="Kolaborasi Tim Aktif"
          description="Bekerja bersama tanpa hambatan dengan sinkronisasi instan untuk seluruh anggota tim."
        />

        {/* Feature 3: Long Card (Span 2) */}
        <FeatureCard 
          className="md:col-span-2 md:row-span-1 border-primary/5"
          icon={<Tags className="h-8 w-8 text-emerald-400" />}
          title="Label Pintar"
          description="Kategorikan prioritas dengan sistem pelabelan dinamis."
        />

        {/* Feature 4: Long Card (Span 4) */}
        <FeatureCard 
          className="md:col-span-4 md:row-span-1 bg-muted/30"
          icon={<MessageSquare className="h-8 w-8 text-primary" />}
          title="Diskusi Terpusat & Kontekstual"
          description="Hilangkan feedback yang hilang di email. Simpan semua percakapan tepat di dalam tugas yang sedang dikerjakan agar konteks tetap terjaga."
        />
      </div>

      {/* Trust Badges - Cleaner Version */}
      <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6 border-y border-primary/5 py-10">
          <BadgeItem icon={<ShieldCheck />} label="Keamanan Terjamin" />
          <BadgeItem icon={<CloudIcon />} label="Penyimpanan Cloud" />
          <BadgeItem icon={<BarChart3 />} label="Laporan Mingguan" />
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, className }: FeatureProps) => (
  <div className={cn(
    "group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-primary/10 p-8 transition-all duration-500",
    "hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5",
    className
  )}>
    {/* Glow Effect */}
    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-opacity group-hover:opacity-100" />
    
    <div className="relative z-10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-primary/10 shadow-sm group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">
        {description}
      </p>
    </div>

    {/* Decorative line */}
    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-blue-400 transition-all duration-700 group-hover:w-full" />
  </div>
);

const BadgeItem = ({ icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground/60 transition-colors hover:text-primary">
    <span className="text-primary/60">{icon}</span>
    <span className="tracking-wide uppercase text-[10px]">{label}</span>
  </div>
);