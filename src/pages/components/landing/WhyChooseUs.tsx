import { CalendarSvg, ChartSvg, CuveSvg, MathSvg, PlanSvg, StudentSvg } from "@/components/svgs/others";
import { motion } from "framer-motion";
import { Star, Clock, BookOpen, BarChart2, Users, Sparkles } from "lucide-react";

const benefits = [
    {
        title: "1-to-1 Personalized Attention",
        desc: "Every child learns at their own pace with full focus from the tutor.",
        icon: <PlanSvg />,
    },
    {
        title: "Visual & Interactive Math",
        desc: "Concepts explained with visuals so learning feels engaging, not boring.",
        icon: <MathSvg />,
    },
    {
        title: "Covers School Curriculum",
        desc: "Our program is aligned with grades 1–8 school standards.",
        icon: <StudentSvg />,
    },
    {
        title: "Flexible Scheduling",
        desc: "Choose times that fit your child’s daily routine.",
        icon: <CalendarSvg />
    },
    {
        title: "Experienced Tutors",
        desc: "Friendly, engaging, and trained in making math fun.",
        icon: <CuveSvg />,
    },
    {
        title: "Progress Tracking",
        desc: "Parents receive regular updates on student improvement.",
        icon: <ChartSvg />,
    },
];

// Floating math symbols
const mathSymbols = ["π", "√", "∑", "∞", "+"];

export default function WhyChooseUs() {
    return (
        <section id="why-us" className="py-24 bg-background relative overflow-hidden">
            {/* Background floating math symbols */}
            {mathSymbols.map((symbol, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        opacity: [0.05, 0.15, 0.05],
                        y: [0, -20, 0],
                        x: [0, i % 2 === 0 ? 15 : -15, 0],
                    }}
                    transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute text-7xl md:text-8xl font-bold text-gray-300 select-none pointer-events-none"
                    style={{
                        top: `${20 + i * 12}%`,
                        left: `${10 + i * 15}%`,
                        zIndex: 0,
                    }}
                >
                    {symbol}
                </motion.span>
            ))}

            {/* Heading */}
            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    Why choose us
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Built to make math click
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    Everything about MathEinstein is designed for real understanding — and real confidence.
                </p>
            </div>
            <div className="max-w-6xl mx-auto px-6 text-center mt-20 relative z-10">
                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true }}
                            className="group relative rounded-2xl border border-border bg-card p-8 text-left shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_22px_50px_-12px_rgba(37,99,235,0.18)]"
                        >
                            {/* top edge highlight */}
                            <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                            {/* Floating Icon chip */}
                            <div className="absolute -top-7 left-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent ring-1 ring-primary/15 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.25)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                                {item.icon}
                            </div>

                            {/* Content */}
                            <h3 className="mt-12 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.a
                    href="#book-demo"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-20 inline-flex items-center justify-center rounded-2xl bg-primary px-12 py-4 text-base font-bold text-primary-foreground shadow-[0_16px_34px_-10px_rgba(37,99,235,0.5)] transition hover:shadow-[0_22px_46px_-10px_rgba(37,99,235,0.6)]"
                >
                    Book a Free Trial Today
                </motion.a>
            </div>
        </section>
    );
}
