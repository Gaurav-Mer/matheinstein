import { motion, type Variants } from "framer-motion";
import FloatingMath from "@/components/FloatingMath";

const benefits = [
  {
    emoji: "🎯",
    title: "One-to-one, all-in",
    desc: "Your child, one tutor, zero distractions — learning at exactly their pace, not the class average.",
    tint: "#eff6ff",
    badge: "linear-gradient(135deg,#3b82f6,#2563eb)",
  },
  {
    emoji: "👀",
    title: "Math you can see",
    desc: "Abstract ideas become visuals, stories and games — so it clicks instead of dragging.",
    tint: "#ecfdf5",
    badge: "linear-gradient(135deg,#22c55e,#16a34a)",
  },
  {
    emoji: "📚",
    title: "Built on their syllabus",
    desc: "Aligned to school from Grade 1 — then exam prep and Olympiad when they're hungry for more.",
    tint: "#fff7ed",
    badge: "linear-gradient(135deg,#fbbf24,#f59e0b)",
  },
  {
    emoji: "⏰",
    title: "Fits your week",
    desc: "Flexible slots around school, sport and dinner. You pick the times — we show up.",
    tint: "#faf5ff",
    badge: "linear-gradient(135deg,#a855f7,#7c3aed)",
  },
  {
    emoji: "🧑‍🏫",
    title: "Tutors kids adore",
    desc: "Warm, patient specialists trained to make math feel like play, never a lecture.",
    tint: "#ecfeff",
    badge: "linear-gradient(135deg,#22d3ee,#0891b2)",
  },
  {
    emoji: "📈",
    title: "You see the progress",
    desc: "A simple note after every session — no more guessing how your child is really doing.",
    tint: "#fdf2f8",
    badge: "linear-gradient(135deg,#f472b6,#db2777)",
  },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 14 } },
};

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-background py-24">
      <FloatingMath />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
            Why choose us
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything a nervous kid (and parent) needs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Built for real understanding and real confidence — not just another worksheet.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="group relative overflow-hidden rounded-3xl border border-white/70 p-7 text-left shadow-[0_18px_44px_-20px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.04]"
              style={{ background: `linear-gradient(to bottom right,#ffffff,${item.tint})` }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg ring-1 ring-white/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                style={{ background: item.badge }}
              >
                {item.emoji}
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14 text-center">
          <motion.a
            href="#book-demo"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-[0_16px_34px_-10px_rgba(37,99,235,0.5)] transition"
          >
            Book a free trial today
          </motion.a>
        </div>
      </div>
    </section>
  );
}
