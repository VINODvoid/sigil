"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight, Activity, Shield, Clock, Hash, Database, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapabilityBadge } from "@/components/app/CapabilityBadge";
import { SectionReveal } from "@/components/app/SectionReveal";
import { IssueSigilDialog } from "./IssueSigilDialog";
import { SpendBar } from "./SpendBar";
import { MOCK_PRINCIPAL, MOCK_SIGILS } from "@/data/mock";
import type { Sigil } from "@/types";
import { cn } from "@/lib/utils";

function StatusIndicator({ status }: { status: Sigil["status"] }) {
  const isOnline = status === "active";
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2 w-2">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isOnline ? "bg-emerald-500" : status === "revoked" ? "bg-destructive" : "bg-muted-foreground/40"
          )}
        ></span>
      </div>
      <span className={cn(
        "font-mono text-[10px] tracking-[0.15em] uppercase",
        isOnline ? "text-emerald-600" : status === "revoked" ? "text-destructive" : "text-muted-foreground/60"
      )}>
        {status}
      </span>
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setTimeout(onDone, 2500)}
      className="fixed bottom-10 right-10 z-50 bg-foreground text-background text-[11px] font-mono tracking-widest uppercase px-6 py-4 rounded-none border border-foreground/10 shadow-2xl flex items-center gap-4"
    >
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      {message}
    </motion.div>
  );
}

export function DashboardView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Structural Top Border */}
      <div className="h-px w-full bg-border/40 mb-12" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Cinematic Header */}
        <SectionReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="px-3 py-1 border border-border/60 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/60 uppercase">
                    Node Active
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                  {MOCK_PRINCIPAL.walletAddress.slice(0,4)}...{MOCK_PRINCIPAL.walletAddress.slice(-4)}
                </span>
              </div>
              <h1 className="hero-display text-[clamp(3.5rem,6vw,5.5rem)] text-foreground leading-[0.95] tracking-tight">
                Principal<br />
                <span className="italic text-muted-foreground/60">Command.</span>
              </h1>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-6">
              <div className="text-left lg:text-right">
                <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase mb-2">
                  Network Status
                </div>
                <div className="font-mono text-[12px] text-foreground font-medium">
                  SYNCED — SOLANA MAINNET
                </div>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                className="rounded-none bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-[12px] font-mono tracking-widest uppercase gap-3"
              >
                <Plus size={16} strokeWidth={2.5} />
                Provision Sigil
              </Button>
            </div>
          </div>
        </SectionReveal>

        {/* Structural Grid for Stats */}
        <SectionReveal delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-border/40 divide-y md:divide-y-0 md:divide-x divide-border/40 mb-24">
            {[
              { label: "Total Issued", value: MOCK_PRINCIPAL.totalIssued, icon: Activity },
              { label: "Active Nodes", value: MOCK_PRINCIPAL.activeCount, icon: Shield },
              { label: "Revoked", value: MOCK_PRINCIPAL.revokedCount, icon: Clock },
              { label: "Total Exposure", value: "$4.2M", icon: Database },
            ].map((stat, i) => (
              <div key={stat.label} className="p-8 lg:p-10 relative group overflow-hidden bg-background hover:bg-foreground/[0.01] transition-colors">
                <stat.icon size={20} strokeWidth={1.5} className="text-foreground/40 absolute top-8 right-8" />
                <div className="font-mono text-[3rem] lg:text-[4rem] font-light text-foreground tabular-nums leading-none tracking-tighter mb-4">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Ledger / Sigil List */}
        <div className="space-y-8">
          <SectionReveal delay={0.08}>
            <div className="flex items-end justify-between mb-8">
              <h2 className="hero-display text-[2.5rem] leading-none text-foreground">
                Active Ledger
              </h2>
              <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase flex items-center gap-2">
                <Hash size={12} className="text-foreground/40" />
                {MOCK_SIGILS.length} Records Found
              </div>
            </div>
          </SectionReveal>

          <div className="border-t border-border/40">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 py-4 px-6 border-b border-border/20 bg-foreground/[0.01]">
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Agent Node</div>
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Capabilities</div>
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Exposure (24H)</div>
              <div className="col-span-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Status</div>
              <div className="col-span-1 text-right font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Rep</div>
            </div>

            {/* Table Rows */}
            {MOCK_SIGILS.map((sigil, i) => (
              <motion.div
                key={sigil.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/dashboard/sigils/${sigil.id}`}>
                  <div className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 p-6 border-b border-border/20 hover:bg-foreground/[0.02] transition-all cursor-pointer items-center relative overflow-hidden">
                    {/* Hover indicator line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />

                    {/* Agent Info */}
                    <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
                      <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={10} className="text-foreground/30" />
                        {sigil.id.slice(0, 12)}
                      </span>
                      <span className="font-medium text-[15px] text-foreground">
                        {sigil.agentName}
                      </span>
                    </div>

                    {/* Capabilities */}
                    <div className="col-span-1 lg:col-span-3 flex flex-wrap gap-1.5">
                      {sigil.capabilities.slice(0, 3).map((cap) => (
                        <CapabilityBadge key={cap} capability={cap} className="bg-transparent border-border/40" />
                      ))}
                      {sigil.capabilities.length > 3 && (
                        <span className="font-mono text-[9px] text-muted-foreground/40 px-2 py-0.5">
                          +{sigil.capabilities.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Spend Limit */}
                    <div className="col-span-1 lg:col-span-3 pr-8 flex items-center gap-3">
                       <Zap size={14} className={cn("text-amber-500/40", sigil.status !== 'active' && "grayscale opacity-30")} />
                       {sigil.status === "active" ? (
                         <div className="w-full max-w-[200px]">
                           <SpendBar spent={sigil.spentToday} limit={sigil.spendLimitPerDay} />
                         </div>
                       ) : (
                         <span className="font-mono text-[11px] text-muted-foreground/40">—</span>
                       )}
                    </div>

                    {/* Status */}
                    <div className="col-span-1 lg:col-span-2">
                      <StatusIndicator status={sigil.status} />
                    </div>

                    {/* Rep & Action */}
                    <div className="col-span-1 lg:col-span-1 flex items-center justify-between lg:justify-end gap-4">
                       <span className="font-mono text-[14px] text-foreground tabular-nums">
                         {sigil.reputation.toFixed(1)}
                       </span>
                       <ArrowUpRight size={18} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dialogOpen && (
          <IssueSigilDialog
            onClose={() => setDialogOpen(false)}
            onSuccess={() => {
              setDialogOpen(false);
              setToast("SIGIL_PROVISIONED_SUCCESSFULLY");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
