"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function Class5Curriculum() {
    return (
        <motion.div
            key="class5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-orange-100 border-2 border-orange-500 -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-300">
                    <BarChart3 className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-4xl font-bold text-orange-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {[
                    "Decimals & Percentages",
                    "Basics of Geometry",
                    "Data Handling (charts & graphs)",
                    "Logical Reasoning",
                ].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-orange-50 px-3 p-12 rounded-lg text-3xl justify-center">
                        <span className="text-orange-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-orange-500 border-t pt-4">
                “Graphs and data handling boosted her confidence.”
            </p>
        </motion.div>
    );
}
