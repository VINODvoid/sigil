"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  KeyRound,
  ScanLine,
  Coins,
  Star,
  Compass,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: KeyRound,
    title: "On-chain identity",
    description:
      "Every Sigil is a PDA on Solana — cryptographically tied to the agent's keypair and principal. Unforgeable, auditable, permanent.",
  },
  {
    icon: ScanLine,
    title: "Capability scopes",
    description:
      "Define exactly what an agent can do: image generation, code review, payments, data access. Enforced at the protocol level.",
  },
  {
    icon: Coins,
    title: "Spend limits",
    description:
      "Per-transaction and daily spend ceilings in USDC. Limits are verified on-chain before every transaction — no middleware needed.",
  },
  {
    icon: Star,
    title: "Reputation scoring",
    description:
      "Every completed transaction updates the agent's on-chain reputation score. Inspectable by anyone at any time.",
  },
  {
    icon: Compass,
    title: "Agent discovery",
    description:
      "A permissionless registry to discover Sigil-verified agents by capability, reputation, and stake — the DNS for the agent economy.",
  },
  {
    icon: ShieldCheck,
    title: "Stake & liability",
    description:
      "Agents post SOL collateral on Sigil issuance. Misbehavior triggers slashing. Principals have real, on-chain recourse.",
  },
];

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
    <span className={`line-reveal-parent ${className}`}>
      <motion.span
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex flex-col gap-5 p-7 border border-border rounded-2xl bg-card hover:border-foreground/15 hover:shadow-[0_12px_48px_rgba(0,0,0,0.07)] transition-colors duration-300 cursor-default"
    >
      <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
        <Icon
          size={16}
          strokeWidth={1.5}
          className="text-foreground/60 group-hover:text-background transition-colors duration-300"
        />
      </div>
      <div>
        <h3 className="font-semibold text-[15px] text-foreground mb-2">
          {feature.title}
        </h3>
        <p className="text-[0.84rem] text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="min-h-screen flex items-center py-20 md:py-32 border-t border-border snap-start bg-background">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground/50 uppercase"
            >
              Capabilities
            </motion.span>
            <h2 className="hero-display text-[clamp(3rem,5.5vw,5.5rem)] text-foreground mt-5">
              <LineReveal delay={0.05} className="block">
                Everything
              </LineReveal>
              <LineReveal delay={0.15} className="block italic">
                trust requires.
              </LineReveal>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[0.9rem] text-muted-foreground leading-relaxed max-w-[360px] pb-2"
          >
            A complete identity stack for the agent economy. Issue, verify,
            enforce, and build — all composable, all on-chain.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
