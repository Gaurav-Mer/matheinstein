import { motion } from "framer-motion";
import { Star, Clock, BookOpen, BarChart2, Users, Sparkles } from "lucide-react";

const benefits = [
    {
        title: "1-to-1 Personalized Attention",
        desc: "Every child learns at their own pace with full focus from the tutor.",
        icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
        title: "Visual & Interactive Math",
        desc: "Concepts explained with visuals so learning feels engaging, not boring.",
        icon: <Sparkles className="w-8 h-8 text-primary" />,
    },
    {
        title: "Covers School Curriculum",
        desc: "Our program is aligned with grades 1–8 school standards.",
        icon: <BookOpen className="w-8 h-8 text-primary" />,
    },
    {
        title: "Flexible Scheduling",
        desc: "Choose times that fit your child’s daily routine.",
        icon: <Clock className="w-8 h-8 text-primary" />,
    },
    {
        title: "Experienced Tutors",
        desc: "Friendly, engaging, and trained in making math fun.",
        icon: <Star className="w-8 h-8 text-primary" />,
    },
    {
        title: "Progress Tracking",
        desc: "Parents receive regular updates on student improvement.",
        icon: <BarChart2 className="w-8 h-8 text-primary" />,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 bg-white text-white rounded-3xl relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 text-center">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-16 bg-primary w-full text-white -mx-4 -rotate-1 inline-block px-6 py-2"
                >
                    Why Choose Us?
                </motion.h2>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, rotateX: 15 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            whileHover={{
                                scale: 1.05,
                                rotateX: 5,
                                rotateY: -5,
                                boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
                            }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white rounded-2xl shadow-lg relative group transform perspective-1000"
                        >
                            {/* Icon container */}
                            <motion.div
                                whileHover={{ y: -6, scale: 1.1 }}
                                className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 shadow-md absolute -top-6 left-6"
                            >
                                {item.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 className="mt-10 text-xl font-semibold text-gray-800">
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
                    className="mt-16 px-10 py-4 bg-white text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
                >
                    Book a Free Trial Today
                </motion.button>
            </div>
        </section>
    );
}
