import { motion } from "framer-motion";

const stats = [
  { value: "3,600+", label: "lessons delivered" },
  { value: "90%", label: "improved 2+ grade boundaries" },
  { value: "98%", label: "course completion" },
  { value: "4.9★", label: "from 84 parents" },
  { value: "20+", label: "countries taught" },
];

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
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold shadow-sm">
            <span className="font-bold text-amber-500">★ 4.9</span>
            <span className="text-muted-foreground">from 84 parents</span>
            <span className="text-border">·</span>
            <span className="font-semibold text-secondary">Super Tutor</span>
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            Stop memorizing.{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#2563eb 0%,#16a34a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Start seeing.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Math that finally <span className="font-semibold text-foreground">clicks</span>. We turn abstract concepts into{" "}
            <span className="font-semibold text-foreground">interactive 3-D simulations</span> kids can see and explore —
            building real understanding from Grade 1 to exam prep and Olympiad.
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
          <SimPanel />
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

function SimPanel() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" /> 3-D simulation · live
          </span>
          <span className="font-mono">rotate to explore</span>
        </div>
        <div className="relative mt-4 aspect-square overflow-hidden rounded-2xl bg-[#f1f5fb] ring-1 ring-border">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(37,99,235,0.10) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.10) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <motion.svg viewBox="-60 -60 120 120" className="absolute inset-0 m-auto h-3/4 w-3/4" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}>
            <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <line x1="0" y1="-50" x2="0" y2="0" stroke="#16a34a" strokeWidth="2.5" />
            <line x1="43" y1="25" x2="0" y2="0" stroke="#16a34a" strokeWidth="2.5" />
            <line x1="-43" y1="25" x2="0" y2="0" stroke="#16a34a" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3.5" fill="#16a34a" />
          </motion.svg>
          <span className="absolute bottom-3 left-3 rounded-lg bg-white px-2 py-1 font-mono text-xs text-primary shadow-sm">f(x) = x³</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["∑", "π", "√"].map((s) => (
            <div key={s} className="rounded-xl border border-border bg-muted py-2 text-center text-lg font-bold text-primary">
              {s}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-10 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-lg"
      >
        📐 Geometry, unfolding
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-3 bottom-12 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-lg"
      >
        ⚖️ Algebra, balancing
      </motion.div>
    </div>
  );
}
