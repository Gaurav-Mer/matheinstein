"use client";

import { AboutUsSvg } from "@/components/svgs/illustrate";
import { motion } from "framer-motion";
import { GraduationCap, Users, FunctionSquare, } from "lucide-react";

export default function AboutUs() {
    return (
        <section id="about" className="relative bg-card  overflow-hidden">
            {/* Decorative Math Grid */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="mathGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M40 0 L0 0 0 40" fill="none" stroke="black" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mathGrid)" />
                </svg>
            </div>
            <div className="relative z-10 mx-auto max-w-2xl pt-20 text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    About us
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Meet MathEinstein
                </h2>
            </div>
            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center mt-4 py-24 px-6 md:px-12">
                {/* Left: Story */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-4xl font-extrabold text-foreground leading-tight"
                    >
                        We’re on a mission to make{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">Math Visual</span>
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-0"></span>
                        </span>
                        , Fun & Easy.
                    </motion.h2>

                    <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
                        <span className="font-semibold">MathEinstein</span> was built with one belief: <span className="font-semibold">math shouldn’t feel scary.</span>
                        For too long, kids have struggled with abstract numbers and rote memorization.
                        We reimagined math as an interactive, visual-first journey where concepts come alive, confidence grows, and curiosity thrives.
                    </p>

                    <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-lg">
                        Today, we proudly help kids from <span className="font-semibold">Classes 1–8 </span>
                        fall in love with math — while giving parents peace of mind with progress tracking and
                        expert-designed curriculum.
                    </p>

                    {/* Highlights */}
                    <div className="mt-10 grid sm:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-card border-2 border-border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center"
                        >
                            <GraduationCap className="w-10 h-10 text-yellow-600 mb-3" />
                            <h4 className="font-bold text-foreground">Expert Curriculum</h4>
                            <p className="text-sm text-muted-foreground mt-1">Designed by educators & math experts</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-card border-2 border-border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center"
                        >
                            <FunctionSquare className="w-10 h-10 text-yellow-600 mb-3" />
                            <h4 className="font-bold text-foreground">Visual Learning</h4>
                            <p className="text-sm text-muted-foreground mt-1">Concepts explained with real-world visuals</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-card border-2 border-border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center"
                        >
                            <Users className="w-10 h-10 text-yellow-600 mb-3" />
                            <h4 className="font-bold text-foreground">Parent Dashboard</h4>
                            <p className="text-sm text-muted-foreground mt-1">Track progress anytime, anywhere</p>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Illustration / Trust */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="relative w-full max-w-md mx-auto">
                        <AboutUsSvg />

                    </div>
                </motion.div>
            </div>
        </section>
    );
}
