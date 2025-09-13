"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How is this curriculum different from traditional learning?",
        answer:
            "Our curriculum is visual-first, structured by grade, and emphasizes real-world math applications. Students learn through interactive examples and visual puzzles rather than rote memorization.",
    },
    {
        question: "Can my child skip ahead if they find a topic easy?",
        answer:
            "Yes! Each child follows a personalized path. They can progress faster through topics they excel at while revisiting areas that need reinforcement.",
    },
    {
        question: "Are the classes suitable for beginners?",
        answer:
            "Absolutely! Each class is designed to build foundational concepts step by step, ensuring no child is left behind.",
    },
    {
        question: "Do you provide progress tracking?",
        answer:
            "Yes, parents and students can track learning progress through our dashboard and see improvements over time.",
    },
];

export default function FAQS() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="relative py-16 px-6 md:px-12">
            {/* Heading */}
            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl font-extrabold text-center bg-primary text-white -mx-12 -rotate-1"
            >
                FAQs
            </motion.h2>
            {/* FAQ List */}
            <div className="divide-y divide-black/20  max-w-3xl mx-auto mt-12">
                {faqs.map((faq, idx) => {
                    const isOpen = activeIndex === idx;

                    return (
                        <motion.div key={idx} layout>
                            {/* Question Row */}
                            <button
                                onClick={() => setActiveIndex(isOpen ? null : idx)}
                                className="w-full flex items-center justify-between py-10 text-left focus:outline-none"
                            >
                                <span
                                    className={`text-lg font-medium ${isOpen ? "text-black" : "text-gray-800"
                                        }`}
                                >
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="ml-4 flex-shrink-0"
                                >
                                    {isOpen ? (
                                        <Minus className="w-5 h-5 text-black" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-black" />
                                    )}
                                </motion.div>
                            </button>

                            {/* Answer */}
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            height: { duration: 0.4, ease: "easeInOut" },
                                            opacity: { duration: 0.3 },
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-5 text-gray-700 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
