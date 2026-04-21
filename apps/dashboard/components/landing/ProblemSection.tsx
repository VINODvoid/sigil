"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

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
  smoothProgress,
  rangeIn,
  rangePeak,
  rangeOut,
}: {
  problem: (typeof problems)[0];
  smoothProgress: any;
  rangeIn: [number, number];
  rangePeak: [number, number];
  rangeOut: [number, number];
}) {
  const opacity = useTransform(
    smoothProgress,
    [rangeIn[0], rangeIn[1], rangePeak[0], rangePeak[1], rangeOut[0], rangeOut[1]],
    [0, 1, 1, 1, 1, 0]
  );
  
  const y = useTransform(
    smoothProgress,
    [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]],
    [20, 0, 0, -20]
  );

  const scale = useTransform(
    smoothProgress,
    [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]],
    [0.99, 1, 1, 0.99]
  );

  const numberOpacity = useTransform(
    smoothProgress,
    [rangeIn[0], rangeIn[1]],
    [0, 1]
  );

  return (
    <motion.div
      style={{ 
        opacity, 
        y, 
        scale,
      }}
      className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-end">
        <div>
          {/* Number */}
          <motion.div
            style={{ opacity: numberOpacity }}
            className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground/70 uppercase mb-8"
          >
            {problem.number} — {problem.aside}
          </motion.div>

          {/* Title — enormous Cormorant */}
          <h2 className="hero-display text-[clamp(4.2rem,8.5vw,9.5rem)] text-foreground mb-10 whitespace-pre-line tracking-tight leading-[0.9]">
            {problem.title}
          </h2>

          {/* Body */}
          <p className="text-[1.15rem] text-muted-foreground leading-relaxed max-w-[620px]">
            {problem.body}
          </p>
        </div>

        {/* Large number watermark */}
        <div className="hidden lg:block">
          <span className="font-display font-light text-[15rem] leading-none text-foreground/[0.06] select-none tabular-nums">
            {problem.number}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressDot({
  smoothProgress,
  range,
}: {
  smoothProgress: any;
  range: { in: [number, number]; peak: [number, number]; out: [number, number] };
}) {
  const opacity = useTransform(
    smoothProgress,
    [range.in[0], range.peak[0], range.peak[1], range.out[1]],
    [0.2, 1, 1, 0.2]
  );
  return (
    <motion.div
      style={{ opacity }}
      className="w-1 h-1 rounded-full bg-foreground"
    />
  );
}

export function ProblemSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ULTRA FAST & RESPONSIVE SPRING
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.0001
  });

  const introOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.05], [0, -10]);
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Fast, snapping ranges
  const ranges: Array<{
    in: [number, number];
    peak: [number, number];
    out: [number, number];
  }> = [
    { in: [0.05, 0.12], peak: [0.12, 0.24], out: [0.24, 0.28] },
    { in: [0.30, 0.37], peak: [0.37, 0.49], out: [0.49, 0.53] },
    { in: [0.55, 0.62], peak: [0.62, 0.74], out: [0.74, 0.78] },
    { in: [0.80, 0.87], peak: [0.87, 0.95], out: [0.95, 0.98] },
  ];

  return (
    <section
      id="protocol"
      ref={containerRef}
      className="relative snap-start bg-background"
      style={{ minHeight: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scaleX: progressScaleX }} className="scroll-line" />
        <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute top-0 left-0 right-0 flex items-end px-6 md:px-16 pt-24 pb-8"
        >
          <div className="flex items-end justify-between w-full max-w-6xl mx-auto">
            <span className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground/50 uppercase">
              The problem
            </span>
            <span className="font-display italic text-[1.1rem] text-muted-foreground/50 hidden md:block">
              One scroll per failure.
            </span>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center">
          <div className="relative w-full h-full">
            {problems.map((problem, i) => (
              <ProblemSlide
                key={problem.number}
                problem={problem}
                smoothProgress={smoothProgress}
                rangeIn={ranges[i].in}
                rangePeak={ranges[i].peak}
                rangeOut={ranges[i].out}
              />
            ))}
          </div>
        </div>

        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {ranges.map((r, i) => (
            <ProgressDot key={i} smoothProgress={smoothProgress} range={r} />
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/30 uppercase">
            Fast resolution
          </span>
        </div>
      </div>
    </section>
  );
}
