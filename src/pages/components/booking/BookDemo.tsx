"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

const BookDemo = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://app.tutorbird.com/Widget/v4/Widget.ashx?settings=eyJTY2hvb2xJRCI6InNjaF9ZbFpKMCIsIldlYnNpdGVJRCI6Indic181d0NKcCIsIldlYnNpdGVCbG9ja0lEIjoid2JiX054TE5KciJ9"; // replace `id` with your actual TutorBird settings ID
        script.async = true;
        script.defer = true;

        const container = document.getElementById("tutorbird-widget");
        if (container) {
            container.innerHTML = ""; // clear any previous widget
            container.appendChild(script);
        }
    }, []);

    return (
        <div className="w-full p-4 mt-12" id="book-demo">
            {/* Heading */}
            <motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative text-4xl md:text-6xl py-1  font-extrabold text-center bg-primary text-white -mx-12 -rotate-1"
                >
                    Select slot
                </motion.h2>
            </motion.div>
            <motion.div className="max-w-4xl mx-auto text-center mt-12">
                <motion.p initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl md:text-5xl font-extrabold text-gray-900">Select perferred date time and book your slot</motion.p>
                <div id="tutorbird-widget" className="mt-8"></div>
            </motion.div>
        </div>
    );
};

export default BookDemo;
