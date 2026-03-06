import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tombol muncul setelah scroll 400px
      setShowTopBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Scroll yang halus, bukan lompat instan
    });
  };

  return (
    <AnimatePresence>
      {showTopBtn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[99]"
        >
          <Button
            onClick={goToTop}
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full shadow-2xl transition-all duration-300",
              "bg-primary/90 backdrop-blur-md border border-white/20 text-white",
              "hover:scale-110 hover:bg-primary active:scale-95"
            )}
            title="Kembali ke atas"
          >
            <ArrowUp className="h-6 w-6 animate-bounce duration-[2000ms]" />
          </Button>
          
          {/* Ring dekoratif di sekeliling tombol */}
          <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/20 duration-[3000ms]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};