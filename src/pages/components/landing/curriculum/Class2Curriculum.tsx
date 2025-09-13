"use client";

import { motion } from "framer-motion";
import { BookOpen, Ruler } from "lucide-react";

export default function Class2Curriculum() {
    return (
        <motion.div
            key="class2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-blue-100 border-2 border-blue-500  -rotate-1  rounded-2xl p-8  max-w-full mx-"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-300">
                    <Ruler className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-4xl font-bold text-blue-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {["Place Value", "Basic Measurement", "Patterns & Sequences", "Simple Word Problems"].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-blue-50 px-3 p-12 rounded-lg text-3xl justify-center ">
                        <span className="text-blue-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-blue-500 border-t pt-4">
                “Math is now playtime for my son in Class 2.”
            </p>
        </motion.div>
    );
}
