"use client";

import { SuccessSvg } from "@/components/svgs/others";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import React from "react";

const featuresBefore = [
    "Heavy focus on memorization",
    "Minimal real-world connection",
    "Low student engagement",
    "Confusion builds frustration",
];

const featuresAfter = [
    "Interactive visual explanations",
    "Real-world connections to math",
    "High engagement & curiosity",
    "Confidence and clarity in learning",
];

const BeforeAndAfter = () => {
    return (
        <section className="relative py-24 px-6 md:px-12 bg-card text-foreground overflow-hidden">
            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:70px_70px]" />

            {/* Heading */}
            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    The difference
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Before &amp; After
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    From <span className="font-semibold text-foreground">confusion</span> to{" "}
                    <span className="font-semibold text-foreground">clarity</span> — see how visual-first learning transforms math.
                </p>
            </div>

            <motion.div
                initial={{ scale: 0.95, opacity: 0.6 }}
                animate={{ scale: [0.95, 1, 0.95], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2 border-amber-400/70 pointer-events-none"
            />

            {/* Comparison */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
            >
                {/* BEFORE */}
                <div className="flex flex-col items-center text-center md:text-left">
                    <p className="mb-4 inline-flex items-center rounded-full bg-card px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-rose-600">
                        Before
                    </p>
                    <div className="space-y-3 mb-6">
                        {featuresBefore.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 text-sm md:text-lg text-muted-foreground"
                            >
                                <CheckCircle className="h-5 w-5 text-red-400" />
                                {item}
                            </motion.div>
                        ))}
                    </div>
                    <div className="relative w-full max-w-[320px] md:max-w-[360px] aspect-[9/14] rounded-2xl overflow-hidden shadow-xl border border-border bg-muted">
                        <video
                            src="/videos/before.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-neutral-200/50 pointer-events-none" />
                    </div>
                </div>

                {/* AFTER */}
                <div className="flex flex-col items-center text-center md:text-left">
                    <p className="mb-4 inline-flex items-center rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-secondary">
                        After
                    </p>
                    <div className="space-y-3 mb-6">
                        {featuresAfter.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 text-sm md:text-lg font-mono  text-muted-foreground"
                            >
                                <SuccessSvg className="h-6 w-6 text-primary" />
                                {item}
                            </motion.div>
                        ))}
                    </div>
                    <div className="relative w-full max-w-[320px] md:max-w-[360px] aspect-[9/14] rounded-2xl overflow-hidden shadow-2xl border border-amber-300/60 bg-muted">
                        <video
                            src="/videos/after.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/50 pointer-events-none" />
                    </div>
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-amber-400 to-transparent rounded-full"
                />
            </motion.div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                {[
                    { value: "1000+", label: "Students Improved Grades" },
                    { value: "95%", label: "Parents Report More Confidence" },
                    { value: "5000+", label: "Hours of Classes Delivered" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <p className="text-4xl font-extrabold text-amber-600">
                            {stat.value}
                        </p>
                        <p className="text-muted-foreground mt-2">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-16 flex justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-amber-500 text-white font-semibold shadow-lg hover:bg-amber-400 transition"
                >
                    Experience the Change <ArrowRight className="h-5 w-5" />
                </motion.button>
            </div>
        </section>
    );
};

export default BeforeAndAfter;
