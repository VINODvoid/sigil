"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { SigilLogo } from "@/components/landing/SigilLogo";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/registry", label: "Registry" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: scrolled
            ? "var(--header-bg)"
            : "var(--header-bg-zero)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          borderBottomColor: scrolled
            ? "var(--header-border)"
            : "var(--header-border-zero)",
        }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <SigilLogo
              width={20}
              height={24}
              className="text-foreground shrink-0 transition-opacity group-hover:opacity-60"
            />
            <span className="hero-display text-[1.75rem] leading-none text-foreground tracking-tight">
              sigil
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[13px] transition-colors duration-200",
                    active
                      ? "bg-foreground/6 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/4"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-foreground/60 bg-foreground/4 border border-border/60 rounded-full px-3 py-1 hidden sm:block">
              7xKXtg…AsU
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20" />
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}
