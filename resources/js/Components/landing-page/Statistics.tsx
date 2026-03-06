import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatisticsProps {
  isCompact?: boolean;
}

export const Statistics = ({ isCompact = false }: StatisticsProps) => {
  const stats = [
    { value: 100, label: "Proyek Aktif", suffix: "+" },
    { value: 1000, label: "Tugas Selesai", suffix: "+" },
    { value: 25, label: "Tim Pengguna", suffix: "+" },
    { value: 99, label: "Waktu Aktif", suffix: "%" },
  ];

  return (
    <div className={cn(
      "grid gap-4",
      isCompact ? "grid-cols-2 lg:grid-cols-4 py-4" : "container mx-auto max-w-7xl px-4 py-20 grid-cols-2 lg:grid-cols-4"
    )}>
      {stats.map((stat, index) => (
        <Counter 
          key={stat.label} 
          {...stat} 
          delay={index * 0.1} 
          isCompact={isCompact}
        />
      ))}
    </div>
  );
};

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
  isCompact?: boolean;
}

const Counter = ({ value, label, suffix = "", delay = 0, isCompact }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "group relative flex flex-col items-center justify-center transition-all",
        isCompact 
          ? "p-4" 
          : "rounded-3xl border border-primary/10 bg-card p-8 shadow-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {!isCompact && (
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
      )}

      <div className="relative z-10 text-center">
        <h3 className={cn(
          "font-black tracking-tighter transition-transform group-hover:scale-110 duration-500",
          isCompact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
        )}>
          <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            {count}
          </span>
          <span className="text-primary">{suffix}</span>
        </h3>
        <p className={cn(
          "font-bold uppercase tracking-widest text-muted-foreground/70",
          isCompact ? "text-[10px] md:text-xs" : "text-xs md:text-sm mt-2"
        )}>
          {label}
        </p>
      </div>
    </motion.div>
  );
};