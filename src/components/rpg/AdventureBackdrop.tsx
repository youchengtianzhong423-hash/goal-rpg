"use client";

import { motion } from "framer-motion";

/** Full-screen adventure-style backdrop (under main content, z-0) */
export function AdventureBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #1e1b4b 0%, #4c1d95 18%, #c2410c 42%, #ea580c 58%, #0f172a 78%, #020617 100%)",
        }}
      />

      <div className="absolute inset-0 opacity-70">
        {[
          [12, 8],
          [28, 14],
          [45, 6],
          [62, 18],
          [78, 10],
          [88, 22],
          [18, 28],
          [55, 32],
          [72, 26],
          [92, 12],
          [8, 38],
          [38, 42],
        ].map(([l, t], i) => (
          <motion.span
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_4px_#fff]"
            style={{ left: `${l}%`, top: `${t}%` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      <svg className="absolute bottom-[28%] left-0 h-[38%] w-full opacity-90" preserveAspectRatio="none" viewBox="0 0 1200 200">
        <path d="M0,200 L0,120 L150,80 L280,130 L400,60 L520,100 L680,40 L820,90 L960,50 L1100,100 L1200,70 L1200,200 Z" fill="#0f172a" />
        <path d="M0,200 L0,150 L200,100 L380,140 L550,90 L720,120 L900,80 L1200,110 L1200,200 Z" fill="#020617" opacity="0.85" />
      </svg>

      <div
        className="absolute bottom-0 left-0 right-0 h-[32%]"
        style={{
          background: "linear-gradient(180deg, rgba(15,23,42,0) 0%, #14532d 35%, #166534 55%, #14532d 100%)",
        }}
      />
      <div
        className="absolute bottom-[8%] left-[12%] right-[12%] h-[6%] rounded-full opacity-40 blur-sm"
        style={{
          background: "radial-gradient(ellipse at center, rgba(254,243,199,0.5) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-indigo-950/30"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
