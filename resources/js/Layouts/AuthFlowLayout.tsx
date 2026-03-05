import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuthFlowLayout({ children }: PropsWithChildren) {
  const { props } = usePage();
  const { toast } = useToast();
  const errorMessages = Object.values(props.errors || {});
  const shownErrors = useRef<Set<string>>(new Set());

  useEffect(() => {
    errorMessages.forEach((errorMessage) => {
      if (errorMessage && !shownErrors.current.has(errorMessage as string)) {
        toast({
          title: "Terjadi Kesalahan",
          description: errorMessage as string,
          variant: "destructive",
        });
        shownErrors.current.add(errorMessage as string);
      }
    });

    if (errorMessages.length === 0) {
      shownErrors.current.clear();
    }
  }, [errorMessages, toast]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Dekorasi Background Dinamis */}
      <div className="absolute -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] -top-24 -left-24 animate-pulse" />
      <div className="absolute -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px] -bottom-24 -right-24" />

      <div className="z-10 w-full max-w-md space-y-8">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="group flex flex-col items-center gap-4 transition-transform active:scale-95">
            <div className="rounded-2xl bg-primary/10 p-1 shadow-sm transition-all group-hover:bg-primary/20">
              <ApplicationLogo variant="circular" className="h-16 w-16 shadow-lg" />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter text-foreground">
                Workdei.
              </h2>
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Empowering teams, simplifying work.
              </p>
            </div>
          </Link>
        </div>

        {/* Card Content Wrapper */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>

        {/* Footer Kecil */}
        <p className="text-center text-xs text-muted-foreground/60 italic">
          &copy; {new Date().getFullYear()} PT Next Generation Solutions.
        </p>
      </div>
    </div>
  );
}