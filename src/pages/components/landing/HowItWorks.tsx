import { motion } from "framer-motion";
import {
    GraphSvg,
    LearningSvg,
    ScreenSvg,
    TutorSvg,
} from "@/components/svgs/others";

const steps = [
    {
        title: "Book a Free Trial",
        desc: "Parents choose grade & convenient time slot.",
        svg: <ScreenSvg />,
    },
    {
        title: "Meet Your Tutor",
        desc: "Student gets matched with a friendly math tutor.",
        svg: <TutorSvg />,
    },
    {
        title: "Interactive Learning",
        desc: "Engaging sessions with visual aids and real-time feedback.",
        svg: <LearningSvg />,
    },
    {
        title: "Track Progress",
        desc: "Parents receive updates and kids build confidence.",
        svg: <GraphSvg />,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.25 },
    },
};

import type { Variants } from "framer-motion";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 70, damping: 15 },
    },
};

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative overflow-hidden bg-card py-20  p-12 ">
            {/* Background Grid + Math Symbols */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
                <motion.span
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: [0, -10, 0], opacity: 0.15 }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-12 left-10 text-5xl font-bold text-gray-300"
                >
                    ∑
                </motion.span>
                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: [0, 12, 0], opacity: 0.15 }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute bottom-16 right-12 text-5xl font-bold text-gray-300"
                >
                    √
                </motion.span>
            </div>

            {/* Heading */}
            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    How it works
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Get started in 4 simple steps
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    A clear, simple journey to better math learning.
                </p>
            </div>

            {/* Steps */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-20 grid gap-12 lg:grid-cols-2"
            >
                {steps.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.03,
                            y: -10,
                            boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 14 }}
                        className="relative flex flex-col md:flex-row items-center gap-6 p-10 rounded-3xl border border-border bg-card shadow-md overflow-hidden"
                    >
                        {/* Subtle background math grid */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] [background-size:20px_20px]" />

                        {/* Step Number */}
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -2 }}
                            transition={{ type: "spring", stiffness: 150 }}
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg relative z-10"
                        >
                            {`0${index + 1}`}
                        </motion.div>

                        {/* Text */}
                        <div className="flex-1 text-center md:text-left relative z-10">
                            <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-muted-foreground text-base md:text-lg leading-relaxed">
                                {item.desc}
                            </p>
                        </div>

                        {/* Icon with 3D premium effect */}
                        <motion.div
                            whileHover={{
                                scale: 1.2,
                                y: -6,
                                rotate: index % 2 === 0 ? 6 : -6,
                            }}
                            transition={{ type: "spring", stiffness: 120, damping: 10 }}
                            className="flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-2xl bg-card shadow-lg border border-border relative z-20"
                            style={{ perspective: "1000px" }}
                        >
                            <motion.div
                                whileHover={{ rotateY: index % 2 === 0 ? 14 : -14, scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="w-14 h-14 flex items-center justify-center"
                            >
                                {item.svg}
                            </motion.div>
                        </motion.div>

                        {/* Glow math effect */}
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition duration-500" />
                    </motion.div>
                ))}
            </motion.div>

        </section>
    );
}
