import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { MessageCircleQuestion, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Apakah WorkDei benar-benar gratis?",
    answer:
      "Tentu saja. WorkDei dirancang sebagai solusi produktivitas yang dapat diakses oleh siapa saja. Anda bisa menikmati manajemen proyek, kanban board, dan fitur catatan tanpa biaya berlangganan atau batasan fitur tersembunyi.",
    value: "pricing",
  },
  {
    question: "Bagaimana pembagian peran dalam tim?",
    answer:
      "Kami menggunakan sistem peran yang sederhana namun efektif. Manajer Proyek memiliki kendali penuh atas pengaturan dan undangan tim, sementara Anggota Proyek fokus pada eksekusi tugas, diskusi, dan pembaruan progres kerja secara real-time.",
    value: "roles",
  },
  {
    question: "Apakah ada batasan jumlah anggota proyek?",
    answer:
      "Sama sekali tidak. Anda bebas mengundang rekan sebanyak yang dibutuhkan. Cukup kirim undangan melalui email, dan tim Anda bisa langsung berkolaborasi dalam satu ruang kerja digital yang terpadu.",
    value: "invitations",
  },
  {
    question: "Bagaimana fitur Catatan membantu pekerjaan saya?",
    answer:
      "Fitur Catatan kami terintegrasi langsung di dashboard. Anda bisa menyimpan ide cepat, daftar belanja teknis, atau memo penting dengan sistem kartu berwarna ala Google Keep, sehingga ide brilian Anda tidak akan pernah hilang.",
    value: "notes-feature",
  },
  {
    question: "Dapatkah saya mengelola banyak proyek berbeda?",
    answer:
      "Sangat bisa. WorkDei mendukung pembuatan multi-proyek. Anda bisa beralih dari satu proyek ke proyek lain dengan cepat melalui sidebar, masing-masing dengan ekosistem tugas dan tim yang berdiri sendiri.",
    value: "multiple-projects",
  },
  {
    question: "Bagaimana cara WorkDei menjaga keteraturan tugas?",
    answer:
      "Kami menyediakan Kanban Board dinamis, label prioritas yang dapat dikustomisasi, dan kolom komentar di setiap tugas. Semua ini dirancang agar alur kerja tim tetap transparan dan mudah dipantau dari layar mana pun.",
    value: "organization",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container mx-auto max-w-3xl px-4 py-24 sm:py-32">
      {/* Header FAQ yang Lebih Artistik */}
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Sparkles className="h-4 w-4 fill-current" />
          Pusat Bantuan
        </div>
        <h2 className="text-4xl font-black tracking-tighter md:text-6xl">
          Sering ditanyakan ke{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent italic">
            WorkDei.
          </span>
        </h2>
        <p className="mt-6 text-lg font-medium text-muted-foreground/80">
          Temukan jawaban cepat untuk memulai perjalanan produktivitas Anda bersama kami.
        </p>
      </div>

      {/* List FAQ dengan Border Lembut & Hover Effect */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem 
            key={value} 
            value={value} 
            className="group overflow-hidden rounded-[1.5rem] border border-primary/5 bg-card px-6 py-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
          >
            <AccordionTrigger className="py-4 text-left text-lg font-bold tracking-tight hover:no-underline group-data-[state=open]:text-primary">
              <div className="flex items-center gap-4">
                <span className="flex h-2 w-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                {question}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pl-6 text-base font-medium leading-relaxed text-muted-foreground/80">
              <div className="border-l-2 border-primary/10 pl-4">
                {answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Footer FAQ */}
      <div className="mt-16 text-center">
        <p className="text-sm font-semibold text-muted-foreground">
          Punya pertanyaan lain?{" "}
          <a href="#" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
            Hubungi kami
          </a>
        </p>
      </div>
    </section>
  );
};