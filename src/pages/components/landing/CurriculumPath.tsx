"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Class1Curriculum from "./curriculum/Class1Curriculm";
import Class2Curriculum from "./curriculum/Class2Curriculum";
import Class3Curriculum from "./curriculum/Class3Curriculum";
import Class4Curriculum from "./curriculum/Class4Curriculum";
import Class5Curriculum from "./curriculum/Class5Curriculum";
import Class6Curriculum from "./curriculum/Class6Curriculum";
import Class7Curriculum from "./curriculum/Class7Curriculum";
import Class8Curriculum from "./curriculum/Class8Curriculum";
import { Calculator, PieChart, Ruler, FunctionSquare, BarChart3, BookOpen, Grid, } from "lucide-react";
import FloatingMath from "@/components/FloatingMath";


const classes = [
    { id: 1, label: "Class 1", icon: Calculator, component: <Class1Curriculum /> },
    { id: 2, label: "Class 2", icon: Ruler, component: <Class2Curriculum /> },
    { id: 3, label: "Class 3", icon: PieChart, component: <Class3Curriculum /> },
    { id: 4, label: "Class 4", icon: Grid, component: <Class4Curriculum /> },
    { id: 5, label: "Class 5", icon: BarChart3, component: <Class5Curriculum /> },
    { id: 6, label: "Class 6", icon: FunctionSquare, component: <Class6Curriculum /> },
    { id: 7, label: "Class 7", icon: Calculator, component: <Class7Curriculum /> },
    { id: 8, label: "Class 8", icon: BookOpen, component: <Class8Curriculum /> },
];

export default function CurriculumPath() {
    const [activeClass, setActiveClass] = useState(1);

    return (
        <section id="curriculum" className="relative overflow-hidden py-24 px-6 md:px-0">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(55% 45% at 88% -5%, #DBEAFE 0%, rgba(219,234,254,0) 60%), radial-gradient(50% 42% at 5% 25%, #DCFCE7 0%, rgba(220,252,231,0) 60%)",
                }}
            />
            <FloatingMath />
            <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    Learning path
                </span>
            </div>
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mt-4 mb-14">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                >
                    From counting to algebra —{" "}
                    <span
                        style={{
                            background: "linear-gradient(90deg,#2563eb,#16a34a)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        a clear path to mastery
                    </span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-lg text-muted-foreground"
                >
                    We’ve designed a grade-wise, structured program that makes math simple, visual, and fun.
                </motion.p>
            </div>

            {/* Class Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {classes.map((cls) => {
                    const Icon = cls.icon;
                    return (
                        <motion.button
                            key={cls.id}
                            onClick={() => setActiveClass(cls.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 transition ${activeClass === cls.id
                                ? "bg-primary text-primary-foreground border border-primary shadow-lg shadow-primary/25"
                                : "bg-card text-foreground border border-border hover:border-primary/40 hover:bg-accent"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${activeClass === cls.id ? "text-white" : "text-muted-foreground"}`} />
                            {cls.label}
                        </motion.button>
                    );
                })}
            </div>


            {/* Class Curriculum Display */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeClass}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                    >
                        {classes.find((cls) => cls.id === activeClass)?.component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
