"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

export default function Class7Curriculum() {
    return (
        <motion.div
            key="class7"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-pink-100 border-2 border-pink-500 -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center border border-pink-300">
                    <Calculator className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-4xl font-bold text-pink-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {[
                    "Algebra (expressions & equations)",
                    "Advanced Geometry (angles, circles, triangles)",
                    "Probability & Statistics",
                    "Real-life Problem Solving",
                ].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-pink-50 px-3 p-12 rounded-lg text-3xl justify-center">
                        <span className="text-pink-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-pink-500 border-t pt-4">
                “He now solves complex problems and loves math challenges.”
            </p>
        </motion.div>
    );
}
