import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=32",
    name: "Sarah Chen",
    userName: "Tech Lead di DevCorp",
    comment:
      "WorkDei telah merevolusi cara kami menangani alur kerja proyek. Sistem manajemen tugas dan pelabelannya sangat intuitif.",
  },
  {
    image: "https://i.pravatar.cc/150?img=41",
    name: "Budi Santoso",
    userName: "Product Manager",
    comment:
      "Fitur kolaborasi real-time membuat tim remote kami merasa lebih terhubung dari sebelumnya. Alat yang luar biasa untuk tim modern.",
  },
  {
    image: "https://i.pravatar.cc/150?img=15",
    name: "Emma Thompson",
    userName: "Scrum Master",
    comment:
      "Fitur diskusi tugas menjaga semua komunikasi proyek tetap terorganisir. Tidak ada lagi feedback yang hilang di email.",
  },
  {
    image: "https://i.pravatar.cc/150?img=54",
    name: "James Wilson",
    userName: "DevOps Engineer",
    comment:
      "Interface bersih, fitur bertenaga, dan alat kolaborasi tim yang sangat baik. Tepat seperti yang kami butuhkan untuk workflow agile.",
  },
  {
    image: "https://i.pravatar.cc/150?img=24",
    name: "Maria Garcia",
    userName: "Frontend Developer",
    comment:
      "Label yang dapat dikustomisasi dan pengorganisasian tugas membuat perencanaan sprint kami jauh lebih efisien.",
  },
  {
    image: "https://i.pravatar.cc/150?img=60",
    name: "David Kim",
    userName: "Engineering Manager",
    comment:
      "WorkDei secara signifikan meningkatkan produktivitas tim kami. Kemampuan untuk memantau tugas secara real-time sangat berharga.",
  },
];

export const Testimonials = () => {
  // Setup Autoplay dan Carousel
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  return (
    <section id="testimonials" className="container mx-auto max-w-7xl px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Dipercaya oleh Tim{" "}
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Seluruh Dunia
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Apa kata mereka tentang pengalaman menggunakan WorkDei.
        </p>
      </div>

      {/* Viewport Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map(({ image, name, userName, comment }: TestimonialProps) => (
            <div 
              key={userName} 
              className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
            >
              <Card className="h-full border border-primary/10 bg-muted/30 shadow-sm transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage alt={name} src={image} />
                    <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-bold">{name}</CardTitle>
                    <CardDescription className="text-xs">{userName}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Quote className="absolute -top-2 right-4 h-6 w-6 rotate-180 text-primary/10" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    "{comment}"
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};