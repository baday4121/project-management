import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/Components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Menu, LogIn, Rocket } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import ApplicationLogo from "../ApplicationLogo";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  { href: "#features", label: "Fitur" },
  { href: "#testimonials", label: "Testimoni" },
  { href: "#faq", label: "FAQ" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md transition-all dark:border-b-zinc-800">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container flex h-16 w-screen max-w-7xl items-center justify-between px-4">
          
          {/* Logo Section */}
          <NavigationMenuItem className="flex items-center gap-2">
            <Link href="/" className="group flex items-center gap-2 transition-all hover:opacity-90">
              <ApplicationLogo variant="circular" className="h-9 w-9 shadow-sm" />
              <span className="text-xl font-black tracking-tighter">Workdei.</span>
            </Link>
          </NavigationMenuItem>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {routeList.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
             <ModeToggle />
            <a
              href="https://github.com/baday4121/project-management-app"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden lg:flex"
            >
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <GitHubLogoIcon className="h-5 w-5" />
              </Button>
            </a>
            <Link href={route("login")}>
              <Button variant="ghost" className="font-semibold">Masuk</Button>
            </Link>
            <Link href={route("register")}>
              <Button className="font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Mulai Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex flex-col border-l-primary/10">
                <SheetHeader className="mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <ApplicationLogo variant="circular" className="h-8 w-8" />
                    <span className="text-xl font-black tracking-tighter">Workdei.</span>
                  </SheetTitle>
                  <SheetDescription className="sr-only italic">
                    Menu navigasi mobile
                  </SheetDescription>
                </SheetHeader>
                
                <nav className="flex flex-col gap-4">
                  {routeList.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-4 py-3 text-lg font-semibold transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      {label}
                    </a>
                  ))}
                  
                  <div className="my-6 border-t border-primary/5" />
                  
                  <Link href={route("login")} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 h-12 text-base">
                      <LogIn className="h-4 w-4" />
                      Masuk ke Akun
                    </Button>
                  </Link>
                  <Link href={route("register")} onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-start gap-2 h-12 text-base font-bold">
                      <Rocket className="h-4 w-4" />
                      Mulai Sekarang
                    </Button>
                  </Link>
                  <a
                    href="https://github.com/baday4121/project-management-app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2"
                  >
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <GitHubLogoIcon className="h-4 w-4" />
                      Source Code
                    </Button>
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};