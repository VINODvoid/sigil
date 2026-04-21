"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { SigilLogo } from "./SigilLogo";

// Unique cryptographic-style logs for the "infrastructure" feel
const LOG_MESSAGES = [
  "DECRYPTING_IDENTITY_HASH...",
  "VERIFYING_SOLANA_MAINNET_STATE...",
  "ATTESTING_AGENT_CAPABILITIES...",
  "BOOTSTRAPPING_REPUTATION_ENGINE...",
  "INITIALIZING_SIGIL_PROTOCOL_V0.8.2...",
  "ESTABLISHING_TRUSTLESS_HANDSHAKE...",
  "COMPILING_DYNAMIC_AUTHORIZATION...",
  "SYNCING_ONCHAIN_REGISTRY...",
];

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [logIndex, setLogIndex] = useState(0);
  const [percent, setPercent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 5200);
    
    // Cycle through technical logs - slightly slower for readability
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % LOG_MESSAGES.length);
    }, 600);

    // Realistic non-linear progress - adjusted for longer duration
    const progressInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) return 100;
        // Slower jumps to fill the 5.2s window
        const jump = Math.random() > 0.85 ? 10 : 1.5;
        return Math.min(prev + jump, 100);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Generate random "hash" strings for the background
  const hashes = useMemo(() => {
    if (!mounted) return Array.from({ length: 6 }).map(() => "00000000000");
    return Array.from({ length: 6 }).map(() => 
      Math.random().toString(36).substring(2, 15).toUpperCase()
    );
  }, [mounted]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(20px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* 1. Dynamic Background: Pulsing Radial Gradient */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)]"
          />
          <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />

          {/* 2. Floating Technical Metadata (Four Corners) */}
          <div className="absolute inset-0 p-8 md:p-12 pointer-events-none font-mono text-[9px] tracking-[0.2em] text-foreground/30 uppercase flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  ID: SIGIL_LOAD_PRTCL
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  LATENCY: 24.01MS
                </motion.div>
              </div>
              <div className="text-right flex flex-col gap-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  NET: SOLANA_1.18
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  LOC: EDGE_US_WEST
                </motion.div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="max-w-[200px]">
                <div className="mb-2 opacity-50">Event Log:</div>
                <div className="h-4 overflow-hidden text-[8px] text-foreground/60 lowercase italic">
                  <motion.div
                    key={logIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                  >
                    {LOG_MESSAGES[logIndex]}
                  </motion.div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1">Build: 0.8.2-ALPH</div>
                <div className="opacity-50">© 2026 Sigil Foundation</div>
              </div>
            </div>
          </div>

          {/* 3. Central "Sigil Assembly" */}
          <div className="relative flex flex-col items-center">
            {/* The Logo with a unique "iris" backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              {/* Spinning geometric rings behind logo */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-40px] border border-foreground/[0.04] rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-60px] border border-dashed border-foreground/[0.03] rounded-full"
              />
              
              <SigilLogo width={100} height={120} className="text-foreground relative z-10" />
            </motion.div>

            {/* Title with letter-spacing reveal */}
            <div className="overflow-hidden mb-6">
              <motion.div
                initial={{ y: "100%", letterSpacing: "0.8em" }}
                animate={{ y: 0, letterSpacing: "0.3em" }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="hero-display text-[3.5rem] leading-none text-foreground flex items-center gap-4"
              >
                sigil
              </motion.div>
            </div>

            {/* 4. Innovative Progress Indicator: Hex-Code String */}
            <div className="flex flex-col items-center gap-4">
              <div className="font-mono text-[10px] text-foreground/40 flex gap-2">
                <span>[</span>
                <span className="text-foreground/80">{percent}%</span>
                <span>]</span>
                <span className="w-32 h-[1px] bg-foreground/10 self-center relative overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: `${percent - 100}%` }}
                    className="absolute inset-0 bg-foreground/40"
                  />
                </span>
                <span className="text-foreground/20 font-light truncate w-16">
                  0x{hashes[logIndex % 6]}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Scanline Effect (subtle cinematic detail) */}
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[20vh] bg-gradient-to-b from-transparent via-foreground/[0.015] to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
