"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

const problems = [
  {
    number: "01",
    title: "Identity\ncrisis.",
    body: "An agent claiming to be customer service for Company X could be anyone. There is no way to cryptographically prove an agent's principal — or verify what it is actually authorized to do.",
    aside: "No provable identity",
  },
  {
    number: "02",
    title: "Discovery\nproblem.",
    body: "Agents can't find each other. There is no marketplace, no directory. Only $28K in daily x402 volume — not demand-limited, discovery-limited. The pipes exist but no one can find the faucet.",
    aside: "No agent directory",
  },
  {
    number: "03",
    title: "Reputation\nvacuum.",
    body: "No way to know if an agent is reliable. No consequences for bad behavior. No incentive for good behavior. Trust bootstrapping requires out-of-band coordination that doesn't scale.",
    aside: "No accountability",
  },
  {
    number: "04",
    title: "Liability\nuncertainty.",
    body: "When an agent misbehaves — who pays? No collateral model. No dispute resolution. The principal is fully exposed with zero on-chain recourse. This breaks at enterprise scale.",
    aside: "No liability model",
  },
];

function ProblemSlide({
  problem,
  index,
  total,
  smoothProgress,
}: {
  problem: (typeof problems)[0];
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const enterStart = index * step;
  const enterEnd = index * step + step * 0.5;
  const leaveStart = (index + 1) * step;

  // 3D Stacking: Subtle rotation and cleaner vertical compression
  const y = useTransform(
    smoothProgress,
    [enterStart - 0.1, enterStart, enterEnd, leaveStart, leaveStart + 0.1],
    [
      index === 0 ? 0 : 1000, 
      index === 0 ? 0 : 1000, 
      0, 
      0, 
      -40
    ]
  );

  const rotateX = useTransform(
    smoothProgress,
    [enterStart - 0.1, enterStart, enterEnd, leaveStart],
    [index === 0 ? 0 : 15, index === 0 ? 0 : 15, 0, 0]
  );

  const scale = useTransform(
    smoothProgress,
    [enterStart - 0.1, enterStart, enterEnd, leaveStart, 1],
    [
      index === 0 ? 1 : 0.9, 
      index === 0 ? 1 : 0.9, 
      1, 
      1, 
      0.92 - (total - 1 - index) * 0.02
    ]
  );

  const opacity = useTransform(
    smoothProgress,
    [enterStart - 0.1, enterStart, enterEnd, leaveStart, 1],
    [
      index === 0 ? 1 : 0, 
      index === 0 ? 1 : 0, 
      1, 
      1, 
      0.4 + (index / total) * 0.6
    ]
  );

  // Parallax effect for internal content
  const contentY = useTransform(
    smoothProgress,
    [enterStart, enterEnd, leaveStart, leaveStart + 0.1],
    [40, 0, 0, -20]
  );

  // Opacity for the internal content to reduce noise when covered
  const contentOpacity = useTransform(
    smoothProgress,
    [leaveStart, leaveStart + 0.1],
    [1, 0]
  );

  return (
    <motion.div
      style={{ 
        y,
        scale,
        opacity,
        rotateX,
        zIndex: index,
        perspective: 1000,
      }}
      className="absolute inset-0 flex items-center justify-center px-4 md:px-12 pointer-events-none"
    >
      <div className="relative w-full max-w-5xl h-[60vh] md:h-[65vh] flex flex-col justify-center rounded-[3rem] border border-black/[0.08] bg-zinc-50 shadow-[0_40px_120px_rgba(0,0,0,0.06)] overflow-hidden p-8 md:p-16 lg:p-24 pointer-events-auto">
        {/* Subtle glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.01] via-transparent to-white/[0.05] pointer-events-none" />
        
        <motion.div 
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center"
        >
          <div>
            {/* Number Label */}
            <div className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-12 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-black/10" />
              {problem.number} / {problem.aside}
            </div>

            {/* Title */}
            <h2 className="hero-display text-[clamp(2.5rem,6vw,6.5rem)] text-foreground mb-8 whitespace-pre-line tracking-tight leading-[0.95]">
              {problem.title}
            </h2>

            {/* Body */}
            <p className="text-[1rem] md:text-[1.1rem] text-muted-foreground/90 leading-relaxed max-w-[480px] font-light">
              {problem.body}
            </p>
          </div>

          {/* Large number watermark */}
          <div className="hidden lg:flex justify-end opacity-20">
            <span className="font-display font-light text-[20rem] leading-none text-black/[0.03] select-none tabular-nums tracking-tighter">
              {problem.number}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProgressDot({
  smoothProgress,
  index,
  total,
}: {
  smoothProgress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;
  
  const opacity = useTransform(
    smoothProgress,
    [start - 0.05, start, end, end + 0.05],
    [0.15, 1, 1, 0.15]
  );
  
  const scale = useTransform(
    smoothProgress,
    [start - 0.05, start, end, end + 0.05],
    [1, 1.3, 1.3, 1]
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="w-1.5 h-1.5 rounded-full bg-foreground"
    />
  );
}

export function ProblemSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // LUXURY SMOOTH SPRING - Slightly more responsive
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001
  });

  const introOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.05], [0, -10]);
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section
      id="protocol"
      ref={containerRef}
      className="relative bg-background"
      style={{ minHeight: "350vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scaleX: progressScaleX }} className="scroll-line" />
        <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" />

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute top-0 left-0 right-0 flex items-end px-6 md:px-16 pt-24 pb-8 z-50"
        >
          <div className="flex items-end justify-between w-full max-w-6xl mx-auto border-b border-black/[0.03] pb-8">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground uppercase">
                The protocol
              </span>
              <span className="font-display text-[1.2rem] text-foreground tracking-tight">
                Addressing fundamental agentic failures.
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/40 uppercase hidden md:block">
              Section 02 — Critical Gaps
            </span>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center">
          <div className="relative w-full h-full">
            {problems.map((problem, i) => (
              <ProblemSlide
                key={problem.number}
                problem={problem}
                index={i}
                total={problems.length}
                smoothProgress={smoothProgress}
              />
            ))}
          </div>
        </div>

        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
          {problems.map((_, i) => (
            <ProgressDot 
              key={i} 
              smoothProgress={smoothProgress} 
              index={i} 
              total={problems.length} 
            />
          ))}
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-[1px] h-12 bg-gradient-to-b from-black/0 via-black/10 to-black/0" />
            <span className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground/30 uppercase">
              Scroll to discover
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
