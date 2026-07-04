import { motion } from "framer-motion";
import Image from "next/image";

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
      {/* the character + its floating overlays live in this box so the chips
          anchor to the image, not to the caption below it */}
      <div className="relative">
        {/* soft brand glow behind the character */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-6 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 62% 42%, rgba(37,99,235,0.18), transparent 60%), radial-gradient(circle at 30% 68%, rgba(22,163,74,0.16), transparent 62%)",
          }}
        />

        {/* thought bubble */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-2 top-2 z-20 rounded-2xl rounded-br-sm border border-border bg-white px-4 py-2 font-mono text-sm font-bold text-primary shadow-md"
        >
          E = mc²
        </motion.div>

        <Image
          src="/einstein-hero.png"
          alt="Friendly cartoon of Albert Einstein playing with math symbols"
          width={900}
          height={900}
          priority
          className="relative z-10 mx-auto h-auto w-full"
        />

        {/* floating joy chips */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-0 z-20 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-lg"
        >
          ✨ it just clicked
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-8 right-0 z-20 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-lg"
        >
          🎉 &ldquo;do another one!&rdquo;
        </motion.div>
      </div>

      {/* caption */}
      <div className="relative z-10 mt-3 text-center">
        <p className="font-display text-lg font-extrabold text-foreground">
          &ldquo;Ohhh — <span className="text-secondary">that&apos;s</span>{" "}how it works.&rdquo;
        </p>
        <p className="mt-1 text-xs text-muted-foreground">the moment math stops being scary</p>
      </div>
    </div>
  );
}
