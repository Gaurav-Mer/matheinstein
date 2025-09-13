"use client";

import { motion } from "framer-motion";
import { FunctionSquare } from "lucide-react";

export default function Class6Curriculum() {
    return (
        <motion.div
            key="class6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-cyan-50 border-2 border-cyan-500 -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center border border-cyan-300">
                    <FunctionSquare className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-4xl font-bold text-cyan-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {[
                    "Algebra Basics",
                    "Advanced Geometry",
                    "Probability Introduction",
                    "Word Problems & Logical Thinking",
                ].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-cyan-100 px-3 p-12 rounded-lg text-3xl justify-center">
                        <span className="text-cyan-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-cyan-500 border-t pt-4">
                “She finally understands algebra and loves solving challenges.”
            </p>
        </motion.div>
    );
}
