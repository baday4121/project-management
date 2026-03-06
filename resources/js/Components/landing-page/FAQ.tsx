import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Apakah WorkDei benar-benar gratis untuk digunakan?",
    answer:
      "Benar. WorkDei hadir sebagai platform produktivitas tanpa biaya berlangganan. Anda mendapatkan akses penuh ke manajemen proyek, papan kanban, dan fitur catatan tanpa batasan penggunaan fitur utama.",
    value: "pricing",
  },
  {
    question: "Bagaimana pembagian peran dalam tim di WorkDei?",
    answer:
      "Kami menggunakan dua peran fundamental: Manajer Proyek untuk kendali penuh (undangan tim & pengaturan) dan Anggota Proyek untuk fokus pada eksekusi tugas serta diskusi real-time.",
    value: "roles",
  },
  {
    question: "Berapa banyak anggota yang bisa saya undang?",
    answer:
      "Tidak ada batasan. WorkDei mendukung kolaborasi skala besar. Anda bisa mengundang seluruh tim Anda hanya dengan alamat email mereka dalam hitungan detik.",
    value: "invitations",
  },
  {
    question: "Apa keunggulan fitur Catatan terintegrasi?",
    answer:
      "Fitur Catatan kami dirancang untuk menangkap ide instan tanpa harus keluar dari konteks proyek. Dengan gaya visual kartu berwarna, Anda bisa mengelola memo dan brainstorming dengan sangat cepat.",
    value: "notes-feature",
  },
  {
    question: "Dapatkah saya mengelola banyak proyek sekaligus?",
    answer:
      "Sangat bisa. Dashboard WorkDei dirancang untuk menangani multi-proyek secara simultan. Anda dapat berpindah antar ruang kerja dengan mulus tanpa kehilangan progres kerja.",
    value: "multiple-projects",
  },
  {
    question: "Bagaimana sistem menjaga keteraturan alur kerja?",
    answer:
      "Melalui kombinasi Kanban Board dinamis, label prioritas kustom, dan sistem diskusi di setiap tugas. Semua informasi terpusat, transparan, dan mudah dipantau oleh seluruh tim.",
    value: "organization",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container mx-auto max-w-6xl px-4 py-24 md:py-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* SISI KIRI: Judul & Deskripsi (Sticky pada Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:h-fit space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-4 w-4 fill-current" />
            FAQ & Support
          </div>
          
          <h2 className="text-5xl font-black leading-[1] tracking-tighter md:text-7xl text-foreground">
            Ada <br /> 
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic">
              Pertanyaan?
            </span>
          </h2>
          
          <p className="text-xl font-medium leading-relaxed text-muted-foreground/80">
            Segala hal yang perlu Anda ketahui untuk memaksimalkan produktivitas tim Anda di platform WorkDei.
          </p>
        </div>

        {/* SISI KANAN: List FAQ (Lebar & Bersih) */}
        <div className="lg:col-span-7">
          <Accordion type="single" collapsible className="w-full">
            {FAQList.map(({ question, answer, value }: FAQProps) => (
              <AccordionItem 
                key={value} 
                value={value} 
                className="border-b border-primary/10 py-4 transition-all hover:bg-primary/[0.02]"
              >
                <AccordionTrigger className="group py-6 text-left text-xl font-black tracking-tight hover:no-underline data-[state=open]:text-primary transition-all">
                  <div className="flex items-center gap-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-background group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all">
                       <Plus className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                    </div>
                    <span className="flex-1 leading-tight">{question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10 pl-16 text-lg font-medium leading-relaxed text-muted-foreground/70">
                  <div className="max-w-2xl border-l-4 border-primary/20 pl-8">
                    {answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
};