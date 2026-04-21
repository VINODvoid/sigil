"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SigilLogo } from "@/components/landing/SigilLogo";

const navLinks = [
  { href: "#protocol", label: "Protocol" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
];

const sections = [
  { id: "protocol", label: "Protocol" },
  { id: "how-it-works", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "integrations", label: "Integrations" },
];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px] w-5">
      <motion.span
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-full bg-foreground origin-center"
      />
      <motion.span
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-full bg-foreground origin-center"
      />
    </div>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 60);
    setPastHero(y > 400);
  });

  const activeLabel = pastHero ? sections.find((s) => s.id === activeSection)?.label : undefined;

  return (
    <>
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
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-8 h-[68px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <SigilLogo
              width={22}
              height={26}
              className="text-foreground shrink-0 transition-opacity group-hover:opacity-60"
            />
            <span className="hero-display text-[2rem] leading-none text-foreground tracking-tight">
              sigil
            </span>
          </Link>

          {/* Breadcrumb — current section */}
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <AnimatePresence mode="wait">
              {activeLabel && (
                <motion.div
                  key={activeLabel}
                  initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
                >
                  <span className="opacity-40">sigil</span>
                  <span className="w-1 h-1 rounded-full bg-foreground/20" />
                  <span className="text-foreground/80 font-medium">{activeLabel}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav — right-aligned with wide gaps */}
          <div className="hidden md:flex items-center gap-2">
            <AnimatePresence>
              {!scrolled && (
                <motion.nav
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-10 mr-10"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[13px] text-foreground/55 hover:text-foreground transition-colors duration-200 tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 -mr-1.5 hover:opacity-60 transition-opacity"
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>

          {/* Mobile: hamburger only */}
          <button
            className="md:hidden p-1.5 -mr-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-background/96 backdrop-blur-xl border-b border-border"
          >
            <nav className="max-w-7xl mx-auto px-8 py-6 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
