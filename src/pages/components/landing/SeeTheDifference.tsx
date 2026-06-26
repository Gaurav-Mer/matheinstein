import { HandWithBallSvg, LigthSvg, TickTokMathSvg, StudentSvg } from "@/components/svgs/others";
import { motion } from "framer-motion";

const outcomes = [
    {
        title: "No More Fear of Math",
        desc: "Students feel relaxed and enjoy solving problems without pressure.",
        icon: <StudentSvg />,
    },
    {
        title: "Confidence Boost",
        desc: "Every child gains belief in their ability to tackle math challenges.",
        icon: <LigthSvg />,
    },
    {
        title: "Better Grades",
        desc: "Stronger foundations translate into improved academic performance.",
        icon: <HandWithBallSvg />,
    },
    {
        title: "Love for Learning",
        desc: "Kids start enjoying math as a fun, creative subject, not a burden.",
        icon: <TickTokMathSvg />,
    },
];

export default function SeeTheDifference() {
    return (
        <section className="relative py-20 bg-card overflow-hidden">
            {/* Subtle geometric background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            {/* Heading */}
            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    Real outcomes
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    See the difference
                </h2>
            </div>
            <div className="relative max-w-6xl mx-auto px-6 text-center mt-8">

                <p className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
                    Our mission is to transform the way children experience math —
                    replacing fear with curiosity, and frustration with confidence.
                </p>

                {/* Premium outcome layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
                    {outcomes.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center text-center relative"
                        >
                            {/* Floating icon */}
                            <motion.div
                                whileHover={{ scale: 1.08, y: -6 }}
                                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                                className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-primary/10 [&_svg]:h-20 [&_svg]:w-20"
                            >
                                {item.icon}
                            </motion.div>

                            {/* Title */}
                            <h3 className="mt-6 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                {item.title}
                            </h3>
                            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.desc}</p>

                            {/* Underline accent */}
                            <span className="mt-4 block h-[2px] w-12 bg-primary/70 rounded-full opacity-0 group-hover:opacity-100 transition" />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
