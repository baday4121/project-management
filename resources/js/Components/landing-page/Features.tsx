import { JSX } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ClipboardList, Users2, Tags, MessageSquare, CheckCircle2 } from "lucide-react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <ClipboardList className="h-10 w-10 text-primary" />,
    title: "Manajemen Tugas Pro",
    description:
      "Buat, tugaskan, dan pantau progres kerja dengan mudah. Jaga proyek tetap terorganisir dengan sistem manajemen tugas yang intuitif.",
  },
  {
    icon: <Users2 className="h-10 w-10 text-primary" />,
    title: "Kolaborasi Tim Aktif",
    description:
      "Bekerja bersama tanpa hambatan dengan pembaruan real-time dan fitur kolaboratif yang dirancang untuk tim modern.",
  },
  {
    icon: <Tags className="h-10 w-10 text-primary" />,
    title: "Label Pintar",
    description:
      "Atur dan kategorikan tugas dengan label khusus. Filter tugas secara efisien untuk tetap fokus pada prioritas utama.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Diskusi Terpusat",
    description:
      "Simpan semua komunikasi terkait tugas di satu tempat dengan diskusi berulir dan sistem notifikasi instan.",
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container mx-auto max-w-7xl px-4 py-24 text-center sm:py-32"
    >
      <div className="mb-16 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Fitur Unggulan
        </h2>
        <h3 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Solusi Cerdas untuk{" "}
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Produktivitas Tim
          </span>
        </h3>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Semua yang Anda butuhkan untuk mengelola proyek secara efektif, transparan, 
          dan memastikan tim Anda tetap selaras dalam setiap target.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon, title, description }) => (
          <Card 
            key={title} 
            className="group relative overflow-hidden border-none bg-background shadow-none transition-all hover:bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                  {icon}
                </div>
                <span className="text-xl font-bold">{title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-8 text-center leading-relaxed text-muted-foreground">
              {description}
            </CardContent>
            
            {/* Hover Decorator */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </Card>
        ))}
      </div>

      <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all hover:grayscale-0">
         <div className="flex items-center gap-2 font-medium"><CheckCircle2 className="h-5 w-5" /> Keamanan Terjamin</div>
         <div className="flex items-center gap-2 font-medium"><CheckCircle2 className="h-5 w-5" /> Cloud Storage</div>
         <div className="flex items-center gap-2 font-medium"><CheckCircle2 className="h-5 w-5" /> Laporan Mingguan</div>
      </div>
    </section>
  );
};