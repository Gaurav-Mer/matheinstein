import { motion, type Variants } from "framer-motion";
import { Check, X } from "lucide-react";

const before = [
  "Endless memorising, zero real understanding",
  "Formulas with no “why” behind them",
  "A stomach-ache before every test",
  "Zoning out — and quietly falling behind",
];

const after = [
  "See it first, then genuinely get it",
  "Real “aha” moments that actually stick",
  "Walks into tests calm and ready",
  "Leaning in — and asking for more",
];

const stats = [
  { v: "1,000+", l: "students improved their grades", c: "#2563eb" },
  { v: "95%", l: "of parents report more confidence", c: "#16a34a" },
  { v: "5,000+", l: "hours of classes delivered", c: "#7c3aed" },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 14 } },
};

export default function BeforeAndAfter() {
  return (
    <section className="relative overflow-hidden bg-card py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
            The difference
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            From dread to &ldquo;do another one&rdquo;
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The same child — a few weeks apart. This is the shift visual-first learning makes.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {/* BEFORE */}
          <motion.div
            variants={card}
            className="relative overflow-hidden rounded-3xl border border-rose-200 p-8 shadow-[0_18px_44px_-20px_rgba(15,23,42,0.2)] ring-1 ring-rose-500/[0.06]"
            style={{ background: "linear-gradient(to bottom right,#ffffff,#fff1f2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-md ring-1 ring-white/40" style={{ background: "linear-gradient(135deg,#fb7185,#e11d48)" }}>
                😣
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-rose-500">Before</div>
                <h3 className="font-display text-xl font-extrabold text-foreground">The old way</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {before.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* AFTER */}
          <motion.div
            variants={card}
            className="relative overflow-hidden rounded-3xl border border-green-200 p-8 shadow-[0_22px_50px_-20px_rgba(22,163,74,0.28)] ring-1 ring-green-500/[0.08]"
            style={{ background: "linear-gradient(to bottom right,#ffffff,#ecfdf5)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-md ring-1 ring-white/40" style={{ background: "linear-gradient(135deg,#34d399,#16a34a)" }}>
                🤩
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-secondary">After</div>
                <h3 className="font-display text-xl font-extrabold text-foreground">With MathEinstein</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {after.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-secondary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* stats */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-4xl font-extrabold" style={{ color: s.c }}>
                {s.v}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#book-demo"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
          >
            Experience the change →
          </a>
        </div>
      </div>
    </section>
  );
}
