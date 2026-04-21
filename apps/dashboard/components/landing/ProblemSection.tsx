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
    [30, 0, 0, -30]
  );

  const scale = useTransform(
    smoothProgress,
    [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]],
    [0.985, 1, 1, 0.985]
  );

  const blur = useTransform(
    smoothProgress,
    [rangeIn[0], rangeIn[1], rangePeak[0], rangePeak[1], rangeOut[0], rangeOut[1]],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(10px)"]
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
        filter: blur
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

  // Snappier spring for less "input lag"
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 35,
    restDelta: 0.001
  });

  const introOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.08], [0, -20]);
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Adjusting ranges so the section "releases" faster at the end
  const ranges: Array<{
    in: [number, number];
    peak: [number, number];
    out: [number, number];
  }> = [
    { in: [0.05, 0.15], peak: [0.15, 0.25], out: [0.25, 0.35] },
    { in: [0.28, 0.38], peak: [0.38, 0.48], out: [0.48, 0.58] },
    { in: [0.51, 0.61], peak: [0.61, 0.71], out: [0.71, 0.81] },
    { in: [0.74, 0.84], peak: [0.84, 0.92], out: [0.92, 0.98] },
  ];

  return (
    <section
      id="protocol"
      ref={containerRef}
      className="relative"
      style={{ minHeight: "420vh" }}
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
              Scroll to explore four compounding failures.
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
            Sigil solves all four
          </span>
        </div>
      </div>
    </section>
  );
}
