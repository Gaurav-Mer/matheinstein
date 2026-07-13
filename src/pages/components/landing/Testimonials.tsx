import { motion, type Variants } from "framer-motion";
import FloatingMath from "@/components/FloatingMath";

// NOTE: placeholder testimonials in the right *voice* — swap for real parent
// quotes when available.
const testimonials = [
  {
    quote:
      "She used to cry over homework. Now she runs to the laptop for her session. I don't know what magic this is — but it's working.",
    name: "Priya S.",
    role: "Parent of a Grade 4 student",
    initials: "PS",
    badge: "linear-gradient(135deg,#3b82f6,#2563eb)",
    tint: "#eff6ff",
  },
  {
    quote: "My son said 'that was actually fun' after a math class. I nearly fell off my chair.",
    name: "Daniel R.",
    role: "Parent of a Grade 6 student",
    initials: "DR",
    badge: "linear-gradient(135deg,#22c55e,#16a34a)",
    tint: "#ecfdf5",
  },
  {
    quote:
      "I finally get why it works instead of just memorising. Fractions used to scare me — now I race my brother.",
    name: "Aarav",
    role: "Student, age 11",
    initials: "A",
    badge: "linear-gradient(135deg,#fbbf24,#f59e0b)",
    tint: "#fff7ed",
  },
  {
    quote:
      "The tutor is patient and kind, and the little progress notes keep me in the loop. Best decision we made this year.",
    name: "Meera K.",
    role: "Parent of a Grade 8 student",
    initials: "MK",
    badge: "linear-gradient(135deg,#a855f7,#7c3aed)",
    tint: "#faf5ff",
  },
  {
    quote: "From a C to an A in one term. But the real win? She calls herself 'a math person' now.",
    name: "James T.",
    role: "Parent",
    initials: "JT",
    badge: "linear-gradient(135deg,#22d3ee,#0891b2)",
    tint: "#ecfeff",
  },
  {
    quote:
      "Two very different kids, both hooked. The bedtime argument is now who gets their math session first.",
    name: "Sara & Omar",
    role: "Parents of twins",
    initials: "SO",
    badge: "linear-gradient(135deg,#f472b6,#db2777)",
    tint: "#fdf2f8",
  },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 14 } },
};

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <FloatingMath />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
            Loved by families
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Parents &amp; students, in their own words
          </h2>
          <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-lg leading-relaxed text-muted-foreground">
            <span className="font-bold text-amber-500">★ 4.9</span> average from{" "}
            <span className="font-semibold text-foreground">84 families</span> — here&apos;s why.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/70 p-7 text-left shadow-[0_18px_44px_-20px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.04]"
              style={{ background: `linear-gradient(to bottom right,#ffffff,${t.tint})` }}
            >
              <div className="text-sm tracking-tight text-amber-400" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white shadow-md ring-1 ring-white/40"
                  style={{ background: t.badge }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
