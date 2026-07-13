import { motion } from "framer-motion";

// Faint, gently drifting math operators used as a shared decorative backdrop
// across the content sections — the First-In-Math "there's always motion" feel,
// kept subtle so it never fights the content.
const SIGNS = [
  { c: "π", top: "14%", left: "6%", cls: "text-6xl", color: "rgba(37,99,235,0.10)", dur: 9, delay: 0 },
  { c: "∑", top: "68%", left: "9%", cls: "text-7xl", color: "rgba(22,163,74,0.10)", dur: 11, delay: 1 },
  { c: "√", top: "20%", left: "88%", cls: "text-6xl", color: "rgba(245,158,11,0.12)", dur: 10, delay: 0.5 },
  { c: "÷", top: "76%", left: "85%", cls: "text-6xl", color: "rgba(124,58,237,0.10)", dur: 12, delay: 1.4 },
  { c: "×", top: "44%", left: "48%", cls: "text-5xl", color: "rgba(8,145,178,0.08)", dur: 9.5, delay: 0.8 },
];

export default function FloatingMath() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {SIGNS.map((s, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute select-none font-black ${s.cls}`}
          style={{ top: s.top, left: s.left, color: s.color }}
        >
          {s.c}
        </motion.span>
      ))}
    </div>
  );
}
