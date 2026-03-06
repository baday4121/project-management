import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const Statistics = () => {
  const stats = [
    {
      value: 100,
      label: "Proyek Aktif",
      suffix: "+",
    },
    {
      value: 1000,
      label: "Tugas Selesai",
      suffix: "+",
    },
    {
      value: 25,
      label: "Tim Pengguna",
      suffix: "+",
    },
    {
      value: 99,
      label: "Waktu Aktif",
      suffix: "%",
    },
  ];

  return (
    <section className="container mx-auto max-w-7xl px-4 py-20">
      <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Counter key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>
    </section>
  );
};

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const Counter = ({ value, label, suffix = "", delay = 0 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 detik
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
        "group relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-8 shadow-sm transition-all",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Dekorasi Background Halus */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

      <div className="relative z-10 space-y-2 text-center">
        <h3 className="text-4xl font-black tracking-tighter sm:text-5xl">
          <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            {count}
          </span>
          <span className="text-primary">{suffix}</span>
        </h3>
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80 md:text-base">
          {label}
        </p>
      </div>
    </motion.div>
  );
};