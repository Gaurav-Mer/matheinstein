/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Dr. Amelia Clarke",
        role: "Mathematician, MIT",
        content:
            "The precision and elegance of this platform remind me of solving a well-structured equation. It truly transforms the way we perceive time and efficiency.",
        highlight: ["precision and elegance", "solving a well-structured equation"]
    },
    {
        name: "Rajesh Kumar",
        role: "Data Scientist, Bangalore",
        content:
            "Like a perfectly balanced formula, this tool integrates seamlessly into my workflow. It's where logic meets aesthetics.",
        highlight: ["perfectly balanced formula", "logic meets aesthetics"]
    },
    {
        name: "Sophia Martinez",
        role: "Professor of Applied Mathematics",
        content:
            "The design feels like a geometric proof—clean, structured, and convincing. A premium experience for analytical minds.",
        highlight: ["geometric proof", "clean, structured, and convincing"]
    },
];


export default function Testimonials() {
    return (
        <section className="relative py-28 pt-12 px-6 md:px-0 bg-white text-primary overflow-hidden">
            {/* Subtle backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-95" />
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000,transparent_1px)] bg-[size:60px_60px]" />


            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl font-extrabold text-center bg-primary text-white -mx-12 -rotate-1"
            >
                Testimonials
            </motion.h2>
            <div className="relative mx-auto text-center">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-6 text-lg md:text-xl text-white max-w-2xl mx-auto"
                >
                    Crafted with precision, trusted by minds that value logic and elegance.
                </motion.p>

                {/* Background watermark text */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                >
                    <h2 className="text-[4rem] break-all md:text-[6rem] font-extrabold tracking-wider text-black/10 select-none ">
                        Your Testimonial Awaits
                    </h2>
                </motion.div>


                <div className="relative mx-auto overflow-hidden mt-16 z-10">
                    {/* Smooth scrolling wrapper */}
                    <motion.div
                        className="flex gap-10 self-baseline "
                        animate={{
                            x: ["0%", "100%"], // loop half since array is doubled
                        }}
                        transition={{
                            ease: "linear",
                            duration: 45,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        whileHover={{ animationPlayState: "paused" } as any}
                    >
                        {/* Render testimonials twice for seamless loop */}
                        {[...testimonials,].map((t, i) => (
                            <div
                                key={i}
                                className="min-w-[350px] max-w-[350px] h-fit   bg-white border-primary border-3 rounded-3xl shadow-2xl  overflow-hidden flex-shrink-0"
                            >
                                <div className="relative p-8 flex flex-col items-center text-center">
                                    <Quote className="h-10 w-10 text-black mb-6" />
                                    <p className="text-neutral-800 italic leading-relaxed text-lg">
                                        &quot;{highlightContent(t.content, t.highlight)}&quot;
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-neutral-200 w-full">
                                        <h4 className="text-lg font-semibold text-black bg-primary rounded-md tracking-wide">
                                            {t.name}
                                        </h4>
                                        <span className="text-sm text-black font-medium">
                                            {t.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Elegant floating math-inspired accents */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.15, y: 0 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-16 left-16 text-amber-500 text-6xl font-light select-none"
            >
                ∑
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 0.15, y: 0 }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-20 right-20 text-amber-500 text-5xl font-light select-none"
            >
                ∞
            </motion.div>
        </section>
    );
}

// Function to wrap highlights with span
function highlightContent(content: string, highlights: string[]) {
    let result: React.ReactNode[] = [content];
    highlights.forEach((h) => {
        result = result.flatMap((part) =>
            typeof part === "string"
                ? part.split(new RegExp(`(${h})`, "gi")).map((piece, i) =>
                    piece.toLowerCase() === h.toLowerCase() ? (
                        <span
                            key={piece + i}
                            className="bg-black/60 text-white -rotate-1 px-1 rounded-sm"
                        >
                            {piece}
                        </span>
                    ) : (
                        piece
                    )
                )
                : part
        );
    });
    return result;
}