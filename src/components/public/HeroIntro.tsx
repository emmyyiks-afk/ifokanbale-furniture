"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BRAND = "IFOKANBALE";
const SUBTITLE = "FORMS & FURNITURE WORK";

export function HeroIntro() {
  const [showSkip, setShowSkip] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1200);
    const doneTimer = setTimeout(() => setDone(true), 3200);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const letters = BRAND.split("");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-900">
      {/* ── Animated Mesh Background ── */}
      <div className="absolute inset-0 z-0">
        {/* Base Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="" 
            className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-forest-900/80 mix-blend-multiply" />
        </div>
        
        {/* Moving blobs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-forest-700/40 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 120, -60, 0],
            scale: [1, 1.1, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[5%] -bottom-[5%] h-[50%] w-[50%] rounded-full bg-forest-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[30%] top-[20%] h-[40%] w-[40%] rounded-full bg-gold-600/10 blur-[100px]"
        />

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BT%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      <FloatingShapes />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Brand — letters rise in one by one */}
        <div className="flex flex-wrap justify-center">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.3 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[13vw] leading-none tracking-tight text-gold-500 sm:text-[10vw] md:text-[7.5rem]"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Yellow underline drawing itself */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 h-[3px] w-48 origin-left bg-gold-500 sm:w-72"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.85, ease: "easeOut" }}
          className="mt-6 text-[10px] tracking-[0.45em] text-gold-500 sm:text-sm sm:tracking-[0.55em]"
        >
          {SUBTITLE}
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gold-500"
      >
        <span className="text-[9px] uppercase tracking-[0.35em]">Scroll</span>
        <motion.svg
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && !done && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDone(true)}
            className="absolute right-6 top-6 z-20 rounded-full border border-gold-500/40 px-4 py-2 text-[10px] tracking-[0.25em] text-gold-500 transition hover:bg-gold-500/10"
          >
            SKIP INTRO
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Ambient furniture outlines floating in the background ─── */
function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sparkles/Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0],
            y: [0, -100],
            x: [0, (i % 2 === 0 ? 20 : -20)]
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
          className="absolute h-1 w-1 rounded-full bg-gold-300"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i * 10) % 60}%`
          }}
        />
      ))}

      {/* Chair */}
      <motion.svg
        animate={{ 
          y: [0, -22, 0], 
          rotate: [0, 5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[18%] h-40 w-40 text-gold-500 opacity-[0.12]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M25 75V35a8 8 0 018-8h34a8 8 0 018 8v40" />
        <path d="M25 65h50" />
        <path d="M30 75v10M70 75v10" />
      </motion.svg>

      {/* Table */}
      <motion.svg
        animate={{ 
          y: [0, 26, 0], 
          rotate: [0, -4, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[8%] top-[58%] h-48 w-48 text-gold-500 opacity-[0.1]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M15 40h70M20 40v50M80 40v50" />
        <path d="M12 35h76" />
      </motion.svg>

      {/* Lamp */}
      <motion.svg
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute left-[62%] top-[14%] h-32 w-32 text-gold-500 opacity-[0.08]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M50 20L30 50h40L50 20z" />
        <path d="M50 50v30M35 80h30" />
      </motion.svg>

      {/* Sofa (New) */}
      <motion.svg
        animate={{ 
          x: [0, 15, 0],
          y: [0, 10, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute left-[20%] bottom-[10%] h-36 w-36 text-gold-500 opacity-[0.07]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M10 60v15h80V60M10 60c0-10 5-15 15-15h50c10 0 15 5 15 15M20 45V35h60v10" />
        <path d="M10 75l-5 5M90 75l5 5" />
      </motion.svg>
    </div>
  );
}