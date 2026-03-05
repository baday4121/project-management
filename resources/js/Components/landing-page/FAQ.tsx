import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Apakah WorkDei gratis untuk digunakan?",
    answer:
      "Ya! WorkDei sepenuhnya gratis untuk digunakan dengan semua fitur yang tersedia. Tanpa kartu kredit, tanpa biaya tersembunyi, dan tanpa batasan penggunaan fitur utama.",
    value: "pricing",
  },
  {
    question: "Bagaimana cara kerja peran proyek di WorkDei?",
    answer:
      "Setiap proyek memiliki dua peran utama: Manajer Proyek dan Anggota Proyek. Manajer dapat mengundang anggota, mengelola semua tugas, dan mengatur peran pengguna lain. Anggota dapat membuat tugas mereka sendiri, berpartisipasi dalam diskusi, dan menggunakan semua fitur kolaborasi.",
    value: "roles",
  },
  {
    question: "Dapatkah saya mengundang orang lain ke proyek saya?",
    answer:
      "Tentu saja! Anda bisa mengundang sebanyak mungkin anggota tim yang Anda butuhkan. Cukup masukkan alamat email mereka, dan mereka akan menerima undangan untuk bergabung. Jika belum punya akun, mereka akan diarahkan untuk mendaftar terlebih dahulu.",
    value: "invitations",
  },
  {
    question: "Bagaimana sistem diskusi tugas bekerja?",
    answer:
      "Setiap tugas memiliki bagian diskusi khusus. Tim Anda bisa berkomunikasi, berbagi pembaruan, dan memberikan masukan langsung di sana. Ini menjaga komunikasi tetap teratur di satu tempat tanpa perlu aplikasi chat eksternal atau email yang berantakan.",
    value: "discussions",
  },
  {
    question: "Bagaimana cara mengatur tugas agar lebih rapi?",
    answer:
      "WorkDei menawarkan berbagai cara: label kustom untuk kategorisasi, pengaturan prioritas, tenggat waktu, dan penugasan anggota. Anda bisa memfilter dan mencari tugas berdasarkan parameter ini untuk menemukan apa yang Anda butuhkan dengan cepat.",
    value: "organization",
  },
  {
    question: "Apakah saya bisa mengelola banyak proyek sekaligus?",
    answer:
      "Sangat bisa! Anda dapat membuat dan mengelola beberapa proyek secara bersamaan, masing-masing dengan anggota tim, tugas, dan diskusinya sendiri. Tidak ada batasan jumlah proyek yang dapat Anda buat.",
    value: "multiple-projects",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container mx-auto max-w-4xl px-4 py-24 sm:py-32">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <HelpCircle className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Pertanyaan yang{" "}
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Sering Diajukan
          </span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Segala hal yang perlu Anda ketahui tentang WorkDei dan cara kerjanya.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem 
            key={value} 
            value={value} 
            className="rounded-2xl border bg-muted/20 px-4 transition-all hover:bg-muted/40"
          >
            <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
              {question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-base leading-relaxed text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 rounded-3xl bg-primary/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Masih punya pertanyaan lainnya?
        </h3>
        <p className="mb-6 text-muted-foreground">
          Tim kami siap membantu Anda kapan saja.
        </p>
        <a
          rel="noreferrer noopener"
          href="mailto:baday4121@gmail.com"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Hubungi Kami
        </a>
      </div>
    </section>
  );
};