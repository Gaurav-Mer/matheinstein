import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "3,600+", label: "lessons delivered" },
  { value: "90%", label: "improved 2+ grade boundaries" },
  { value: "98%", label: "course completion" },
  { value: "4.9★", label: "from 84 parents" },
  { value: "20+", label: "countries taught" },
];

// Math + science glyphs that "explode" outward in pseudo-3D when the hero is hovered.
// x/y are px offsets from the character's centre; z (translateZ) + rx/ry give real depth
// under the container's perspective. s = final scale, d = stagger delay.
type Burst = { c: string; x: number; y: number; z: number; rx: number; ry: number; s: number; color: string; d: number; pill?: boolean };
const BURST: Burst[] = [
  { c: "π", x: -140, y: -152, z: 140, rx: 20, ry: -30, s: 1.6, color: "#f59e0b", d: 0.0 },
  { c: "∑", x: 142, y: -146, z: 90, rx: -15, ry: 25, s: 1.35, color: "#2563eb", d: 0.04 },
  { c: "∫", x: 186, y: -14, z: 160, rx: 10, ry: 35, s: 1.7, color: "#16a34a", d: 0.07 },
  { c: "√", x: 150, y: 122, z: 60, rx: -20, ry: 20, s: 1.3, color: "#7c3aed", d: 0.1 },
  { c: "∞", x: 14, y: 180, z: 110, rx: 25, ry: -10, s: 1.45, color: "#0891b2", d: 0.13 },
  { c: "Δ", x: -140, y: 140, z: 50, rx: -15, ry: -25, s: 1.3, color: "#db2777", d: 0.16 },
  { c: "θ", x: -186, y: 14, z: 150, rx: 15, ry: -35, s: 1.6, color: "#2563eb", d: 0.06 },
  { c: "λ", x: -150, y: -130, z: 70, rx: -10, ry: -20, s: 1.2, color: "#16a34a", d: 0.11 },
  { c: "⚛", x: 74, y: -180, z: 190, rx: 30, ry: 15, s: 1.75, color: "#0ea5e9", d: 0.02 },
  { c: "±", x: -96, y: 80, z: 45, rx: -18, ry: 15, s: 1.15, color: "#16a34a", d: 0.18 },
  { c: "%", x: 96, y: -40, z: 80, rx: 0, ry: -30, s: 1.1, color: "#f59e0b", d: 0.15 },
  { c: "E=mc²", x: 116, y: 62, z: 200, rx: 8, ry: -18, s: 1.05, color: "#0f172a", d: 0.0, pill: true },
];

// Always-on "moving signs" (First In Math energy) — glossy operator badges that
// gently drift at the card's edges even before you hover.
const AMBIENT = [
  { c: "÷", bg: "#2563eb", cls: "-top-5 left-8", dur: 4.5, delay: 0 },
  { c: "×", bg: "#f59e0b", cls: "-top-3 right-8", dur: 5.2, delay: 0.6 },
  { c: "+", bg: "#16a34a", cls: "bottom-16 -left-4", dur: 4.8, delay: 0.3 },
  { c: "√", bg: "#7c3aed", cls: "top-1/3 -right-5", dur: 5.6, delay: 0.9 },
];

const CARD_V: Variants = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  explode: { rotateX: 3, rotateY: -5, scale: 1.02 },
};
const GLOW_V: Variants = {
  rest: { opacity: 0.5, scale: 0.9 },
  explode: { opacity: 1, scale: 1.18 },
};
const HINT_V: Variants = {
  rest: { opacity: 1, y: 0 },
  explode: { opacity: 0, y: 6 },
};
const burstV = (b: Burst): Variants => ({
  rest: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, scale: 0.2, opacity: 0 },
  explode: { x: b.x, y: b.y, z: b.z, rotateX: b.rx, rotateY: b.ry, scale: b.s, opacity: 1 },
});

const HeroSection = () => {
  return (
    <section id="top" className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52% 48% at 82% -8%, #DBEAFE 0%, rgba(219,234,254,0) 62%), radial-gradient(44% 42% at 2% 16%, #DCFCE7 0%, rgba(220,252,231,0) 58%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold shadow-sm">
            <span className="font-bold text-amber-500">★ 4.9</span>
            <span className="text-muted-foreground">from 84 parents</span>
            <span className="text-border">·</span>
            <span className="font-semibold text-secondary">kids ask to come back</span>
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            We don&apos;t teach math.{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#2563eb 0%,#16a34a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              We play with it.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            That little <span className="font-semibold text-foreground">gasp</span> when a hard problem suddenly{" "}
            <span className="font-semibold text-foreground">clicks</span>. The{" "}
            <span className="font-semibold text-foreground">&ldquo;wait — give me another one.&rdquo;</span>{" "}
            We turn intimidating, abstract math into something your child actually plays with — one-to-one, at their
            pace, from Grade&nbsp;1 to Olympiad.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#book-demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              Book a free demo →
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
            >
              See how it works
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check /> No pressure, no commitment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield /> Secure booking &amp; payments
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
          <EinsteinPanel />
        </motion.div>
      </div>

      {/* trust stats strip */}
      <div className="border-y border-border bg-muted/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-6 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Shield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function EinsteinPanel() {
  return (
    <div className="relative mx-auto max-w-md">
      <motion.div
        className="group relative cursor-pointer"
        style={{ perspective: 1200 }}
        initial="rest"
        animate="rest"
        whileHover="explode"
        whileTap="explode"
      >
        {/* glowing brand aura that swells on hover */}
        <motion.div
          aria-hidden
          variants={GLOW_V}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="pointer-events-none absolute inset-2 -z-10 rounded-[2.4rem] blur-2xl"
          style={{
            background:
              "radial-gradient(circle at 60% 42%, rgba(37,99,235,0.28), transparent 60%), radial-gradient(circle at 30% 70%, rgba(22,163,74,0.24), transparent 62%), radial-gradient(circle at 78% 74%, rgba(245,158,11,0.18), transparent 60%)",
          }}
        />

        {/* premium framed card holding the character */}
        <motion.div
          variants={CARD_V}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-white to-accent/60 shadow-[0_34px_90px_-32px_rgba(15,23,42,0.4)] ring-1 ring-black/5"
        >
          <Image
            src="/einstein-hero.png"
            alt="Friendly cartoon of Albert Einstein playing with math symbols"
            width={1000}
            height={1000}
            priority
            className="relative z-10 mx-auto h-auto w-full drop-shadow-sm"
          />

          {/* the exploding math + science */}
          {BURST.map((b, i) => (
            <motion.span
              key={i}
              variants={burstV(b)}
              transition={{ type: "spring", stiffness: 170, damping: 12, delay: b.d }}
              style={{
                color: b.color,
                transformStyle: "preserve-3d",
                filter: "drop-shadow(0 8px 12px rgba(15,23,42,0.18))",
              }}
              className={
                b.pill
                  ? "pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2.5 py-1 font-mono text-sm font-bold text-foreground shadow-md ring-1 ring-black/10"
                  : "pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-4xl font-black leading-none"
              }
            >
              {b.c}
            </motion.span>
          ))}

          {/* affordance — fades out the moment it explodes */}
          <motion.div
            variants={HINT_V}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-foreground/85 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur"
          >
            ✨ hover me
          </motion.div>
        </motion.div>

        {/* ambient "moving signs" — always drifting, First In Math energy */}
        {AMBIENT.map((a, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -12, 0], rotate: [0, 7, 0] }}
            transition={{ duration: a.dur, delay: a.delay, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: a.bg }}
            className={`pointer-events-none absolute ${a.cls} z-30 flex h-11 w-11 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg`}
          >
            {a.c}
          </motion.span>
        ))}

        {/* joy chips ride the card corners */}
        <motion.div
          variants={{ rest: { y: 0, rotate: 0 }, explode: { y: -6, rotate: -3 } }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="absolute -bottom-3 left-1 z-30 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-lg"
        >
          ✨ it just clicked
        </motion.div>
        <motion.div
          variants={{ rest: { y: 0, rotate: 0 }, explode: { y: 6, rotate: 3 } }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="absolute -bottom-3 right-1 z-30 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-lg"
        >
          🎉 &ldquo;do another one!&rdquo;
        </motion.div>
      </motion.div>

      {/* caption */}
      <div className="relative z-10 mt-8 text-center">
        <p className="font-display text-lg font-extrabold text-foreground">
          &ldquo;Ohhh — <span className="text-secondary">that&apos;s</span>{" "}how it works.&rdquo;
        </p>
        <p className="mt-1 text-xs text-muted-foreground">the moment math stops being scary</p>
      </div>
    </div>
  );
}
