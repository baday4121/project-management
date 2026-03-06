import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=32",
    name: "Siti Aminah",
    userName: "Lead Developer",
    comment:
      "WorkDei benar-benar mengubah cara tim kami mengelola alur kerja. Sistem manajemen tugasnya sangat intuitif dan sangat membantu efisiensi.",
  },
  {
    image: "https://i.pravatar.cc/150?img=41",
    name: "Budi Santoso",
    userName: "Project Manager",
    comment:
      "Fitur kolaborasi real-time membuat tim remote kami merasa selalu terhubung. Ini adalah tools wajib untuk manajemen proyek modern.",
  },
  {
    image: "https://i.pravatar.cc/150?img=15",
    name: "Dewi Lestari",
    userName: "Business Analyst",
    comment:
      "Diskusi tugas menjaga semua komunikasi tetap terorganisir di satu tempat. Tidak ada lagi feedback yang terselip di antara ribuan email.",
  },
  {
    image: "https://i.pravatar.cc/150?img=54",
    name: "Rizky Pratama",
    userName: "Fullstack Engineer",
    comment:
      "Interface yang bersih dengan fitur yang sangat bertenaga. Sangat tepat untuk menjaga kecepatan workflow kami setiap harinya.",
  },
  {
    image: "https://i.pravatar.cc/150?img=24",
    name: "Anisa Fitri",
    userName: "UI/UX Designer",
    comment:
      "Pengorganisasian tugasnya membuat perencanaan desain kami jauh lebih transparan bagi seluruh anggota tim pengembang.",
  },
  {
    image: "https://i.pravatar.cc/150?img=60",
    name: "Agus Wijaya",
    userName: "Engineering Manager",
    comment:
      "WorkDei secara signifikan meningkatkan produktivitas Nexicon. Kemampuan memantau progres tugas secara real-time sangatlah berharga.",
  },
];

export const Testimonials = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-background py-24">
      <div className="absolute left-1/4 top-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute right-1/4 bottom-0 -z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Testimoni Pengguna
          </div>
          <h2 className="max-w-2xl text-4xl font-black tracking-tighter md:text-6xl">
            Kisah Sukses Bersama{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              WorkDei.
            </span>
          </h2>
        </div>

        <div className="cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
              >
                <div className="relative h-full rounded-[2.5rem] border border-primary/10 bg-gradient-to-b from-muted/50 to-background p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                  <Quote className="mb-6 h-10 w-10 text-primary/20" />
                  
                  <p className="mb-8 text-lg font-medium leading-relaxed italic text-foreground/90">
                    "{item.comment}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-primary/5 pt-6">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {item.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <h4 className="font-bold text-foreground">{item.name}</h4>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.userName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};