import { motion, type Variants } from "framer-motion";

const outcomes = [
  {
    emoji: "😌",
    title: "Fear turns to fun",
    desc: "The dread melts away. They stop avoiding math and start looking forward to it.",
    tint: "#eff6ff",
    badge: "linear-gradient(135deg,#3b82f6,#2563eb)",
  },
  {
    emoji: "💪",
    title: "Confidence that sticks",
    desc: "“I can't” becomes “watch this” — and that belief spills into every other subject.",
    tint: "#ecfdf5",
    badge: "linear-gradient(135deg,#22c55e,#16a34a)",
  },
  {
    emoji: "📊",
    title: "The grades follow",
    desc: "Real understanding — not memorising — turns into real results on the report card.",
    tint: "#fff7ed",
    badge: "linear-gradient(135deg,#fbbf24,#f59e0b)",
  },
  {
    emoji: "❤️",
    title: "A love that lasts",
    desc: "Not just this term — a genuine curiosity for how numbers, and the world, work.",
    tint: "#faf5ff",
    badge: "linear-gradient(135deg,#a855f7,#7c3aed)",
  },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 14 } },
};

export default function SeeTheDifference() {
  return (
    <section className="relative overflow-hidden bg-card py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
            Real outcomes
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            What actually changes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We&apos;re out to change how your child <em>feels</em> about math — the grades are the happy side effect.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {outcomes.map((item, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="group relative overflow-hidden rounded-3xl border border-white/70 p-7 text-center shadow-[0_18px_44px_-20px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.04]"
              style={{ background: `linear-gradient(to bottom right,#ffffff,${item.tint})` }}
            >
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg ring-1 ring-white/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                style={{ background: item.badge }}
              >
                {item.emoji}
              </div>
              <h3 className="mt-5 font-display text-lg font-extrabold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
