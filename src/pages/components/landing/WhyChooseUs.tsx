import { CalendarSvg, ChartSvg, CuveSvg, MathSvg, PlanSvg, StudentSvg } from "@/components/svgs/others";
import { motion } from "framer-motion";
import { Star, Clock, BookOpen, BarChart2, Users, Sparkles } from "lucide-react";

const benefits = [
    {
        title: "1-to-1 Personalized Attention",
        desc: "Every child learns at their own pace with full focus from the tutor.",
        icon: <PlanSvg />,
    },
    {
        title: "Visual & Interactive Math",
        desc: "Concepts explained with visuals so learning feels engaging, not boring.",
        icon: <MathSvg />,
    },
    {
        title: "Covers School Curriculum",
        desc: "Our program is aligned with grades 1–8 school standards.",
        icon: <StudentSvg />,
    },
    {
        title: "Flexible Scheduling",
        desc: "Choose times that fit your child’s daily routine.",
        icon: <CalendarSvg />
    },
    {
        title: "Experienced Tutors",
        desc: "Friendly, engaging, and trained in making math fun.",
        icon: <CuveSvg />,
    },
    {
        title: "Progress Tracking",
        desc: "Parents receive regular updates on student improvement.",
        icon: <ChartSvg />,
    },
];

// Floating math symbols
const mathSymbols = ["π", "√", "∑", "∞", "+"];

export default function WhyChooseUs() {
    return (
        <section id="whyus" className="py-24 bg-white relative overflow-hidden">
            {/* Background floating math symbols */}
            {mathSymbols.map((symbol, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        opacity: [0.05, 0.15, 0.05],
                        y: [0, -20, 0],
                        x: [0, i % 2 === 0 ? 15 : -15, 0],
                    }}
                    transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute text-7xl md:text-8xl font-bold text-gray-300 select-none pointer-events-none"
                    style={{
                        top: `${20 + i * 12}%`,
                        left: `${10 + i * 15}%`,
                        zIndex: 0,
                    }}
                >
                    {symbol}
                </motion.span>
            ))}

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl py-1 font-extrabold text-center bg-primary text-white -mx-12 -rotate-1"
            >
                Why Choose Us
            </motion.h2>
            <div className="max-w-6xl mx-auto px-6 text-center mt-20 relative z-10">
                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, rotateX: 15 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            whileHover={{
                                scale: 1.05,
                                rotateX: 3,
                                rotateY: -3,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                            }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 bg-white rounded-3xl shadow-lg relative group transform perspective-1000 border border-gray-100 hover:border-primary/40"
                        >
                            {/* Floating Icon */}
                            <motion.div
                                whileHover={{ y: -8, scale: 1.1 }}
                                className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary shadow-md absolute -top-8 left-8"
                            >
                                {item.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 className="mt-12 text-xl font-bold text-gray-800 group-hover:text-primary transition">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.button
                    whileHover={{ scale: 1.07, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-20 px-12 py-4 bg-primary  font-semibold text-sm rounded-2xl border-2 border-black text-black transition"
                >
                    Book a Free Trial Today
                </motion.button>
            </div>
        </section>
    );
}
