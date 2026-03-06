import { Link } from "@inertiajs/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import ApplicationLogo from "../ApplicationLogo";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
}

const footerLinks = {
  social: [
    {
      label: "GitHub",
      href: "https://github.com/baday4121/project-management",
      external: true,
      icon: <GitHubLogoIcon className="h-5 w-5" />,
    },
  ],
  explore: [
    { label: "Fitur Unggulan", href: "#features" },
    { label: "Testimoni", href: "#testimonials" },
    { label: "Tanya Jawab", href: "#faq" },
  ],
} as const;

export const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-primary/5 bg-background px-4 py-20 lg:py-32">
      {/* Background Glow Halus */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
          
          {/* KOLOM 1: Brand & Visi (Lebar 5/12) */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <ApplicationLogo variant="circular" className="h-12 w-12 transition-transform group-hover:rotate-12" />
              <span className="text-3xl font-black tracking-tighter">WorkDei</span>
            </Link>
            <p className="text-xl font-medium leading-relaxed text-muted-foreground/80 max-w-md">
              Solusi manajemen proyek cerdas untuk tim modern. Tingkatkan efisiensi dan kolaborasi dalam satu platform terpadu.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-5 py-2.5 text-sm font-bold transition-all hover:bg-primary hover:text-white"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* KOLOM 2: Navigasi (Lebar 3/12) */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Navigasi Proyek</h3>
            <ul className="flex flex-col gap-4">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-lg font-bold text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM 3: CTA & Akses (Lebar 4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Akses Cepat</h3>
            <div className="flex flex-col gap-4">
              <Link href={route("register")} className="w-full">
                <Button className="h-14 w-full text-lg font-black shadow-xl shadow-primary/20">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href={route("login")} className="w-full">
                <Button variant="ghost" className="h-14 w-full text-lg font-bold hover:bg-primary/5">
                  Masuk ke Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* GARIS BAWAH & COPYRIGHT */}
        <div className="mt-24 border-t border-primary/5 pt-12">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="space-y-1">
              <p className="text-sm font-bold text-muted-foreground/60 italic">
                &copy; {new Date().getFullYear()} WorkDei. Semua ide berawal dari sini.
              </p>
              <p className="text-xs font-medium text-muted-foreground/40 uppercase tracking-widest">
                Productivity Platform
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-1">
               <p className="text-sm font-bold text-muted-foreground/60">
                 Crafted by <span className="text-foreground transition-colors hover:text-primary">Baday</span>
               </p>
               <div className="h-1 w-12 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};