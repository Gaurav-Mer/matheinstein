"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Class8Curriculum() {
    return (
        <motion.div
            key="class8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-sky-100 border-2 border-sky-500  -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-300">
                    <BookOpen className="w-7 h-7 text-sky-500" />
                </div>
                <h3 className="text-4xl font-bold text-sky-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {[
                    "Algebra (linear & quadratic)",
                    "Geometry (3D shapes & theorems)",
                    "Probability & Statistics Advanced",
                    "Real-life Application & Problem Solving",
                ].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-sky-50 px-3 p-12 rounded-lg text-3xl justify-center">
                        <span className="text-sky-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-sky-500  pt-4">
                “Class 8 prepared him for high school math with confidence.”
            </p>
        </motion.div>
    );
}
