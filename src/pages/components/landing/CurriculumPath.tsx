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
        <section id="path" className="py-20 px-6 md:px-0  overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl font-extrabold text-center bg-primary pb-1 text-white -mx-12 -rotate-1"
            >
                Learning Path
            </motion.h2>
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto my-16">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-900"
                >
                    From Counting to Algebra —{" "}
                    <span className="text-primary  ">A Clear Path to Math Mastery</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-lg text-gray-600"
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
                            className={`px-5 py-2 rounded-full font-semibold flex items-center gap-2 transition ${activeClass === cls.id
                                ? "bg-secondary text-white  border-black "
                                : "bg-white text-black border border-gray-200 hover:bg-secondary/10"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${activeClass === cls.id ? "text-white" : "text-gray-600"}`} />
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
