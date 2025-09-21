/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const bodmasQuestions: Record<string, { q: string; a: number }[]> = {
    easy: [
        { q: "5 + 3 × 2", a: 11 },
        { q: "12 - 4 × 2", a: 4 },
        { q: "8 + 6 ÷ 2", a: 11 },
        { q: "15 - 9 ÷ 3", a: 12 },
        { q: "4 × 3 + 2", a: 14 },
        { q: "20 ÷ 4 + 1", a: 6 },
        { q: "7 + 2 × 4", a: 15 },
        { q: "18 ÷ 3 - 2", a: 4 }
    ],
    medium: [
        { q: "(8 + 2) × 3", a: 30 },
        { q: "24 ÷ (4 + 2)", a: 4 },
        { q: "5 × (7 - 3)", a: 20 },
        { q: "(15 - 3) ÷ 4", a: 3 },
        { q: "6 + (4 × 2)", a: 14 },
        { q: "(9 + 3) - 5", a: 7 },
        { q: "3 × (8 ÷ 2)", a: 12 },
        { q: "(20 - 8) ÷ 3", a: 4 }
    ],
    hard: [
        { q: "2 × (5 + 3) - 4", a: 12 },
        { q: "18 ÷ (2 + 1) + 7", a: 13 },
        { q: "(15 - 3) ÷ 2 × 3", a: 18 },
        { q: "4 + 3 × (8 - 5)", a: 13 },
        { q: "(24 ÷ 6) × (5 - 2)", a: 12 },
        { q: "20 - (3 + 2) × 2", a: 10 },
        { q: "6 × 2 + (16 ÷ 4)", a: 16 },
        { q: "(35 ÷ 7) + 3 × 4", a: 17 }
    ]
};

export default function QuickMathTest() {
    const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
    const [currentQ, setCurrentQ] = useState<{ q: string; a: number } | null>(null);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [isTestStarted, setIsTestStarted] = useState(false);

    // Clear feedback when answer changes
    useEffect(() => {
        if (answer && feedback) {
            setFeedback(null);
        }
    }, [answer]);

    // Auto clear feedback after 3 seconds
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const getRandomQuestion = () => {
        if (!level) return null;
        const questions = bodmasQuestions[level];
        return questions[Math.floor(Math.random() * questions.length)];
    };

    const startTest = () => {
        if (!level) return;
        const newQuestion = getRandomQuestion();
        setCurrentQ(newQuestion);
        setFeedback(null);
        setAnswer("");
        setIsTestStarted(true);
    };

    const checkAnswer = () => {
        if (!currentQ || !answer.trim()) return;

        const userAnswer = parseFloat(answer.trim());
        const isCorrect = userAnswer === currentQ.a;

        setFeedback(isCorrect ? "correct" : "wrong");
        setScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1
        }));
    };

    const nextQuestion = () => {
        const newQuestion = getRandomQuestion();
        setCurrentQ(newQuestion);
        setFeedback(null);
        setAnswer("");
    };

    const resetTest = () => {
        setLevel(null);
        setCurrentQ(null);
        setAnswer("");
        setFeedback(null);
        setScore({ correct: 0, total: 0 });
        setIsTestStarted(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (feedback) {
                nextQuestion();
            } else {
                checkAnswer();
            }
        }
    };

    return (
        <section className="relative py-32 bg-white overflow-hidden">
            {/* Premium background elements */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.025),transparent_60%)] pointer-events-none" /> */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:100px_100px]" />


            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl font-extrabold text-center bg-primary text-white -mx-12 -rotate-1"
            >
                BODMAS FUN CHALLENGE
            </motion.h2>
            <div className="relative max-w-4xl mx-auto px-8">
                {/* Premium heading */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                </motion.div>

                {/* Main container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className=" p-12 relative overflow-hidden "
                >
                    {/* Difficulty Selection */}
                    {!isTestStarted && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
                                Choose Your <span className="text-primary">Challenge</span> Level
                            </h2>

                            <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
                                {[
                                    {
                                        key: "easy",
                                        label: "Easy",
                                        emoji: QuickMathTest,
                                        desc: "Basic operations with simple BODMAS",
                                        example: "5 + 3 × 2"
                                    },
                                    {
                                        key: "medium",
                                        label: "Medium",
                                        emoji: QuickMathTest,
                                        desc: "Brackets and mixed operations",
                                        example: "(8 + 2) × 3"
                                    },
                                    {
                                        key: "hard",
                                        label: "Hard",
                                        emoji: QuickMathTest,
                                        desc: "Complex multi-step calculations",
                                        example: "2 × (5 + 3) - 4"
                                    }
                                ].map((lvl, index) => (
                                    <motion.button
                                        key={lvl.key}
                                        onClick={() => setLevel(lvl.key as any)}
                                        whileHover={{
                                            scale: 1.05,
                                            y: -8,
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        // transition={{
                                        //     delay: 0.6 + index * 0.1,
                                        //     // hover: { type: "spring", stiffness: 200, damping: 15 }
                                        // }}
                                        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.6 + index * 0.1, }}

                                        className={`group p-8 rounded-3xl border-2 font-bold text-left transition-all duration-300 w-full md:w-80 ${level === lvl.key
                                            ? "bg-primary text-white border-primary shadow-2xl scale-105"
                                            : "bg-white/80 hover:bg-white border-gray-200 text-gray-700 shadow-lg"
                                            }`}
                                    >
                                        {/* <div className="text-4xl mb-4"><QuickMathTest /></div> */}
                                        <div className={twMerge("text-2xl font-black mb-2", level === lvl.key && "text-3xl")}>{lvl.label}</div>
                                        <div className={`text-sm mb-4 leading-relaxed ${level === lvl.key ? "text-white/90" : "text-gray-600"
                                            }`}>
                                            {lvl.desc}
                                        </div>
                                        <div className={`text-lg font-mono p-3 rounded-xl ${level === lvl.key
                                            ? "bg-white/20 text-white"
                                            : "bg-primary/20 text-gray-800 group-hover:bg-primary/30"
                                            }`}>
                                            {lvl.example}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {level && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startTest}
                                    className="px-16 py-5 rounded-3xl bg-primary text-black font-bold text-2xl border-black border-2 transition-all duration-300"
                                >
                                    Start Challenge
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* Question Section */}
                    {isTestStarted && currentQ && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <motion.div
                                key={currentQ.q}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                                className="bg-white rounded-3xl p-12 mb-10 border border-primary/10"
                            >
                                <div className="text-5xl md:text-7xl font-black text-gray-800 mb-8 font-mono tracking-wider">
                                    {currentQ.q} = ?
                                </div>

                                <motion.input
                                    type="number"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="border-3 border-gray-200 rounded-3xl px-8 py-6 w-64 text-center text-3xl font-bold shadow-inner focus:outline-none focus:border-primary focus:ring-6 focus:ring-primary/20 transition-all bg-white"
                                    placeholder="Answer"
                                    autoFocus
                                    disabled={!!feedback}
                                />
                            </motion.div>

                            <div className="flex justify-center gap-6 mb-8">
                                {!feedback ? (
                                    <motion.button
                                        onClick={checkAnswer}
                                        disabled={!answer.trim()}
                                        whileHover={answer.trim() ? { scale: 1.05 } : {}}
                                        whileTap={answer.trim() ? { scale: 0.95 } : {}}
                                        className={`px-12 py-4 rounded-3xl font-bold text-xl transition-all ${answer.trim()
                                            ? "bg-primary text-white shadow-xl hover:shadow-2xl"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        ✓ Submit
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={nextQuestion}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-12 py-4 rounded-3xl bg-primary text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
                                    >
                                        Next Question →
                                    </motion.button>
                                )}

                                <motion.button
                                    onClick={resetTest}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-4 rounded-3xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl shadow-lg transition-all"
                                >
                                    Reset
                                </motion.button>
                            </div>

                            {/* Feedback */}
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className={`inline-flex items-center gap-4 px-10 py-6 rounded-3xl text-2xl font-bold shadow-xl border-2 ${feedback === "correct"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                        }`}
                                >
                                    <span className="text-4xl">
                                        {feedback === "correct" ? "🎉" : "🤔"}
                                    </span>
                                    <div>
                                        <div>
                                            {feedback === "correct"
                                                ? "Perfect! Well done!"
                                                : `Correct answer: ${currentQ.a}`
                                            }
                                        </div>
                                        {feedback === "wrong" && (
                                            <div className="text-lg font-normal mt-1 opacity-80">
                                                Remember: Brackets, Orders, Division/Multiplication, Addition/Subtraction
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section >
    );
}