import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SigilLogo } from "@/components/landing/SigilLogo";

const links = {
  Protocol: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Credentials", href: "#" },
    { label: "Registry", href: "#" },
    { label: "Reputation", href: "#" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "SDK reference", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background snap-start">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <SigilLogo width={22} height={26} className="text-foreground shrink-0" />
              <span className="hero-display text-[2.2rem] leading-none text-foreground tracking-tight">
                sigil
              </span>
            </Link>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[240px]">
              Cryptographic identity and trust infrastructure for the AI agent
              economy.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-wider text-muted-foreground/80 bg-secondary/80 border border-border/60 rounded-full px-3 py-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Devnet live
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-6">
              <div className="text-[11px] font-mono font-medium text-foreground/50 tracking-[0.2em] uppercase">
                {category}
              </div>
              <ul className="flex flex-col gap-3.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-10 opacity-60" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-[13px] text-muted-foreground/60">
            © 2026 Sigil. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
