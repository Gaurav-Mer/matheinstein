import { motion } from "framer-motion";
import { Grid, } from "lucide-react";

export default function Class4Curriculum() {
    return (
        <motion.div
            key="class4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" bg-purple-100 border-2 border-purple-500 -rotate-1  rounded-2xl p-8  max-w-full mx-auto"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center border border-purple-300">
                    <Grid className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-4xl font-bold text-purple-500 px-4 text-center items-center justify-center ">What we are covering </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                {["Decimals", "Symmetry & Patterns", "Daily Life Math", "Problem Solving"].map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 bg-purple-50 px-3 p-12 rounded-lg text-3xl justify-center">
                        <span className="text-purple-500">✔</span> {topic}
                    </li>
                ))}
            </ul>

            <p className="mt-6 italic text-purple-500 border-t pt-4">
                “My son loved symmetry and started spotting patterns everywhere!”
            </p>
        </motion.div>
    );
}
