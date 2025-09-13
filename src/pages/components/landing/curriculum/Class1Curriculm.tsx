import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

export default function Class1Curriculum() {
    return (
        <motion.div
            key="class1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-primary/5 border-2 border-primary -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                    <Calculator className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-4xl font-bold  text-primary px-4 text-center items-center justify-center ">What we are covering  </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {["Numbers & Counting", "Addition & Subtraction", "Fun with Shapes", "Visual Puzzles"].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-primary/10 px-3 justify-center rounded-lg  text-3xl p-12 border-gray-100">
                        <span className="text-primary">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-primary  pt-4">
                “My daughter finally enjoys numbers — no more tears!”
            </p>
        </motion.div>
    );
}
