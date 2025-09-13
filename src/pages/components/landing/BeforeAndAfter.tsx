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
        <section className="relative py-24 px-6 md:px-12 bg-white text-neutral-900 overflow-hidden">
            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:70px_70px]" />

            {/* Heading */}
            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl font-extrabold text-center bg-primary text-white -mx-12 -rotate-1"
            >
                Before & After
            </motion.h2>
            <p className="mt-4 text-center text-lg text-neutral-600 max-w-2xl mx-auto">
                From <span className="font-semibold ">confusion</span> to{" "}
                <span className="font-semibold ">clarity</span> —
                experience how visual-first learning transforms math.
            </p>

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
                    <p className="text-lg md:text-4xl font-bold  mb-4 -rotate-1 rounded-sm bg-primary px-3 text-white">
                        BEFORE
                    </p>
                    <div className="space-y-3 mb-6">
                        {featuresBefore.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 text-sm md:text-lg text-neutral-600"
                            >
                                <CheckCircle className="h-5 w-5 text-red-400" />
                                {item}
                            </motion.div>
                        ))}
                    </div>
                    <div className="relative w-full max-w-[320px] md:max-w-[360px] aspect-[9/14] rounded-2xl overflow-hidden shadow-xl border border-neutral-200 bg-neutral-50">
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
                    <p className="text-lg md:text-4xl font-bold text-white px-3 rounded-sm -rotate-1 bg-secondary mb-4">
                        AFTER
                    </p>
                    <div className="space-y-3 mb-6">
                        {featuresAfter.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 text-sm md:text-lg font-mono  text-neutral-700"
                            >
                                <SuccessSvg className="h-6 w-6 text-primary" />
                                {item}
                            </motion.div>
                        ))}
                    </div>
                    <div className="relative w-full max-w-[320px] md:max-w-[360px] aspect-[9/14] rounded-2xl overflow-hidden shadow-2xl border border-amber-300/60 bg-neutral-50">
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
                        <p className="text-neutral-600 mt-2">{stat.label}</p>
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
