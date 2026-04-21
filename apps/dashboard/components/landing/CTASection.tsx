"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden border-t border-border snap-start bg-background"
    >
      {/* Animated dot grid background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-40px] dot-grid opacity-50 pointer-events-none"
      />

      {/* Radial fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, var(--fade-bg-zero) 0%, var(--fade-bg) 70%, var(--fade-bg) 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground/80 uppercase">
            Get started
          </span>

          <h2 className="font-display text-[clamp(2.6rem,5.5vw,4.8rem)] italic leading-[0.9] text-foreground mt-6 mb-8 tracking-tight">
            Ready to trust
            <br />
            your agents?
          </h2>

          <p className="text-[1.1rem] text-muted-foreground leading-relaxed max-w-[520px] mx-auto mb-12">
            Issue your first Sigil in minutes. One SDK call. No infrastructure
            to run. Works with any Solana wallet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-10 h-14 text-[15px] font-medium gap-2 group shadow-lg shadow-foreground/5 hover:shadow-foreground/10 transition-all"
              )}
            >
              Issue your first Sigil
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/registry"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-10 h-14 text-[15px] font-medium bg-background/40 backdrop-blur-sm hover:bg-background transition-colors"
              )}
            >
              Browse agents
            </Link>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-16 text-[11px] font-mono tracking-wider text-muted-foreground/60 uppercase"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              Free to start
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              No custodial keys
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              Open source SDK
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
