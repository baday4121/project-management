import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Quote } from "lucide-react";

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
  return (
    <section
      id="testimonials"
      className="container mx-auto max-w-7xl px-4 py-24 sm:py-32"
    >
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Dipercaya oleh Tim{" "}
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Seluruh Dunia
          </span>
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Lihat bagaimana WorkDei membantu tim berkolaborasi lebih baik dan menyelesaikan proyek lebih cepat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(({ image, name, userName, comment }: TestimonialProps) => (
          <Card
            key={userName}
            className="flex flex-col justify-between border-none bg-muted/40 shadow-none transition-all hover:bg-muted/70"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20 p-0.5">
                <AvatarImage alt={name} src={image} className="rounded-full" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold">{name}</CardTitle>
                <CardDescription className="text-sm">{userName}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <Quote className="absolute -top-2 right-4 h-8 w-8 rotate-180 text-primary/10" />
              <p className="relative z-10 text-muted-foreground italic">"{comment}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};