"use client";

import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

export default function Class3Curriculum() {
    return (
        <motion.div
            key="class3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-lime-50 border-2 border-lime-500 -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-lime-100 flex items-center justify-center border border-lime-300">
                    <PieChart className="w-7 h-7 text-lime-600" />
                </div>
                <h3 className="text-4xl font-bold text-lime-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {["Multiplication & Division", "Fractions Made Easy", "Measurement & Time", "Intro to Word Problems"].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-lime-100 px-3  p-12 rounded-lg text-3xl justify-center">
                        <span className="text-lime-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-lime-500 border-t pt-4">
                “Fractions became fun for my son in Class 3!”
            </p>
        </motion.div>
    );
}
