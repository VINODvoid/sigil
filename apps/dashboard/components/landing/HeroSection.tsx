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
import { CopyButton } from "@/components/landing/CopyButton";

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

  return (
    <section
      ref={containerRef}
      style={{ position: "relative" }}
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden snap-start bg-background py-24 md:py-32"
    >
      {/* Text content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-foreground font-medium uppercase bg-foreground/5 backdrop-blur-sm border border-border/40 rounded-full px-5 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Agent Infrastructure · Solana
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="hero-display text-[clamp(3.2rem,7vw,7.5rem)] text-foreground mb-10 max-w-6xl leading-[0.95]">
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

        {/* Sub - Improved contrast and spacing */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-[1.15rem] text-foreground/70 leading-relaxed max-w-[580px] mb-12 font-medium"
        >
          AI agents can now transact autonomously. But without identity,
          authorization, and accountability — anyone claiming to be "your agent"
          could be anyone. Sigil fixes that.
        </motion.p>

        {/* Install command - centered more clearly */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 font-mono text-[13px] bg-secondary/40 border border-border/50 rounded-full px-6 py-3">
            <span className="text-muted-foreground/50 select-none">$</span>
            <span className="text-foreground/80">bun add @sigil/sdk</span>
            <CopyButton text="bun add @sigil/sdk" />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-5 mb-24"
        >
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-12 h-16 text-[15px] font-medium gap-2 group shadow-xl shadow-foreground/5 hover:shadow-foreground/10 transition-all bg-foreground text-background"
            )}
          >
            Get started
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/registry"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-12 h-16 text-[15px] font-medium bg-foreground/5 backdrop-blur-sm hover:bg-foreground/10 transition-colors border-border text-foreground"
            )}
          >
            Browse agents
          </Link>
        </motion.div>

        {/* Stats strip - Consistent with dashboard styling, more padding/gap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-full max-w-5xl mx-auto relative z-20"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 px-10 py-8 bg-background/50 backdrop-blur-md rounded-[2rem] border border-border/40 shadow-sm">
            {[
              { value: "847", label: "Active agents" },
              { value: "12.4k", label: "Verified txns" },
              { value: "$2.3M", label: "Protected daily" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <div className="hidden md:block w-px h-10 bg-border/40 mr-16" />}
                <div className="text-center min-w-[130px]">
                  <div className="font-mono text-[1.5rem] font-medium text-foreground tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono tracking-[0.2em] text-foreground/50 font-bold uppercase mt-2">
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
