import { Link } from "@inertiajs/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import ApplicationLogo from "../ApplicationLogo";
import { Button } from "../ui/button";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  title?: string;
  icon?: React.ReactNode;
}

const footerLinks = {
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/baday4121/project-management",
      external: true,
      icon: <GitHubLogoIcon className="h-4 w-4" />,
    },
    {
      label: "Hubungi Kami",
      href: "mailto:baday4121@gmail.com",
      external: true,
    },
  ],
  quickLinks: [
    {
      label: "Fitur Unggulan",
      href: "#features",
    },
    {
      label: "Testimoni",
      href: "#testimonials",
    },
    {
      label: "Tanya Jawab (FAQ)",
      href: "#faq",
    },
  ],
  authLinks: [
    {
      label: "Masuk",
      href: route("login"),
      variant: "outline",
    },
    {
      label: "Daftar Akun",
      href: route("register"),
      variant: "default",
    },
  ],
} as const;

export const Footer = () => {
  const renderExternalLink = (link: FooterLink) => (
    <a
      key={link.label}
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer noopener" : undefined}
      title={link.title || link.label}
      className="max-w-max text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      {link.icon && (
        <span className="flex items-center gap-2">
          {link.icon}
          {link.label}
        </span>
      )}
      {!link.icon && link.label}
    </a>
  );

  return (
    <footer className="container mx-auto max-w-7xl border-t px-4 py-16">
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3">
            <ApplicationLogo variant="circular" className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tight">WorkDei</span>
          </Link>
          <p className="leading-relaxed text-muted-foreground">
            Solusi manajemen proyek cerdas untuk tim modern. Tingkatkan efisiensi dan kolaborasi dalam satu platform terpadu.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.socialLinks.map(renderExternalLink)}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-bold">Tautan Cepat</h3>
          <div className="flex flex-col gap-3">
            {footerLinks.quickLinks.map(renderExternalLink)}
          </div>
        </div>

        {/* Actions Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-bold">Mulai Sekarang</h3>
          <p className="text-sm text-muted-foreground">
            Siap untuk mengoptimalkan alur kerja tim Anda?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {footerLinks.authLinks.map((link) => (
              <Link key={link.label} href={link.href} title={link.label} className="w-full">
                <Button variant={link.variant as any} className="w-full shadow-sm">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-16 border-t pt-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WorkDei - Seluruh hak cipta dilindungi.
          </p>
          <p className="text-sm text-muted-foreground">
            Dikembangkan dengan penuh cinta oleh{" "}
            <span className="font-semibold text-primary">Baday</span>
          </p>
        </div>
      </div>
    </footer>
  );
};