import { motion, type Variants } from "framer-motion";
import FloatingMath from "@/components/FloatingMath";

const steps = [
  {
    n: "01",
    emoji: "📅",
    title: "Book a free trial",
    desc: "Pick your child's grade and a time that fits your week. Two minutes, zero pressure.",
    tint: "#eff6ff",
    badge: "linear-gradient(135deg,#3b82f6,#2563eb)",
  },
  {
    n: "02",
    emoji: "🤝",
    title: "Meet your tutor",
    desc: "Matched with a warm, specialist tutor who genuinely gets kids — and math.",
    tint: "#ecfdf5",
    badge: "linear-gradient(135deg,#22c55e,#16a34a)",
  },
  {
    n: "03",
    emoji: "🎮",
    title: "Play with math",
    desc: "Live, visual, hands-on sessions. No rote drills — just one “aha” after another.",
    tint: "#fff7ed",
    badge: "linear-gradient(135deg,#fbbf24,#f59e0b)",
  },
  {
    n: "04",
    emoji: "🚀",
    title: "Watch them soar",
    desc: "Simple updates land in your inbox as confidence — and grades — start to climb.",
    tint: "#faf5ff",
    badge: "linear-gradient(135deg,#a855f7,#7c3aed)",
  },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 14 } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 12% -5%, #DBEAFE 0%, rgba(219,234,254,0) 60%), radial-gradient(55% 50% at 92% 15%, #DCFCE7 0%, rgba(220,252,231,0) 60%)",
        }}
      />
      <FloatingMath />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
            How it works
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Four steps to that first{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#2563eb,#16a34a)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              &ldquo;aha&rdquo;
            </span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            No jargon, no commitment — just a clear path from &ldquo;ugh&rdquo; to &ldquo;again!&rdquo;
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s) => (
            <motion.div
              key={s.n}
              variants={card}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="group relative overflow-hidden rounded-3xl border border-white/70 p-6 shadow-[0_18px_44px_-20px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.04]"
              style={{ background: `linear-gradient(to bottom right,#ffffff,${s.tint})` }}
            >
              <span className="pointer-events-none absolute -right-1 top-1 font-display text-6xl font-black text-black/[0.05] transition-colors group-hover:text-black/[0.08]">
                {s.n}
              </span>

              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg ring-1 ring-white/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                style={{ background: s.badge }}
              >
                {s.emoji}
              </div>

              <div className="mt-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Step {s.n}
              </div>
              <h3 className="mt-1 font-display text-xl font-extrabold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14 text-center">
          <a
            href="#book-demo"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
          >
            Start with a free trial →
          </a>
        </div>
      </div>
    </section>
  );
}
