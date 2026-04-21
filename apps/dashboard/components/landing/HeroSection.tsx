"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("line-reveal-parent", className)}>
      <motion.span
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -60],
  );
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={containerRef}
      style={{ position: "relative" }}
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Text content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-10 flex flex-col items-center text-center"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-muted-foreground/70 uppercase bg-background/60 backdrop-blur-sm border border-border/40 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" />
            AI Agent Infrastructure · Solana
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="hero-display text-[clamp(3.8rem,6vw,8.5rem)] text-foreground mb-6 max-w-5xl">
          <LineReveal delay={0.22} className="block">
            Cryptographic
          </LineReveal>
          <LineReveal delay={0.36} className="block">
            identity for the
          </LineReveal>
          <LineReveal delay={0.5} className="block italic">
            agent economy.
          </LineReveal>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-[1.1rem] text-muted-foreground leading-relaxed max-w-[540px] mb-10"
        >
          AI agents can now transact autonomously. But without identity,
          authorization, and accountability — anyone claiming to be "your agent"
          could be anyone. Sigil fixes that.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            href="#how-it-works"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-10 h-14 text-[15px] font-medium gap-2 group shadow-lg shadow-foreground/5 hover:shadow-foreground/10 transition-all",
            )}
          >
            Get started
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="#protocol"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-10 h-14 text-[15px] font-medium bg-background/60 backdrop-blur-sm hover:bg-background transition-colors",
            )}
          >
            Read the docs
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-full max-w-4xl mx-auto relative z-20 mt-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 px-8 py-6 bg-background/40 backdrop-blur-md rounded-2xl border border-border/20 shadow-sm">
            {[
              { value: "847", label: "Active agents" },
              { value: "12.4k", label: "Verified txns" },
              { value: "$2.3M", label: "Protected daily" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <div className="hidden md:block w-px h-8 bg-border/40 mr-12" />}
                <div className="text-center min-w-[120px]">
                  <div className="font-mono text-[1.25rem] font-medium text-foreground tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
