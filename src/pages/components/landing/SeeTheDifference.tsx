import { HandWithBallSvg, LigthSvg, TickTokMathSvg, StudentSvg } from "@/components/svgs/others";
import { motion } from "framer-motion";

const outcomes = [
    {
        title: "No More Fear of Math",
        desc: "Students feel relaxed and enjoy solving problems without pressure.",
        icon: <StudentSvg />,
    },
    {
        title: "Confidence Boost",
        desc: "Every child gains belief in their ability to tackle math challenges.",
        icon: <LigthSvg />,
    },
    {
        title: "Better Grades",
        desc: "Stronger foundations translate into improved academic performance.",
        icon: <HandWithBallSvg />,
    },
    {
        title: "Love for Learning",
        desc: "Kids start enjoying math as a fun, creative subject, not a burden.",
        icon: <TickTokMathSvg />,
    },
];

export default function SeeTheDifference() {
    return (
        <section className="relative py-20 bg-white overflow-hidden">
            {/* Subtle geometric background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-4xl md:text-6xl font-extrabold text-center bg-primary text-white  -rotate-1"
            >
                How It Works
            </motion.h2>
            <div className="relative max-w-6xl mx-auto px-6 text-center mt-8">

                <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
                    Our mission is to transform the way children experience math —
                    replacing fear with curiosity, and frustration with confidence.
                </p>

                {/* Premium outcome layout */}
                <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                    {outcomes.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center text-center relative"
                        >
                            {/* Floating icon */}
                            <motion.div
                                whileHover={{ scale: 1.15, y: -6, rotate: index % 2 === 0 ? 4 : -4 }}
                                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                                className="flex items-center justify-center w-96 h-96 rounded-full bg-primary/10 shadow-sm -rotate-3"
                            >
                                {item.icon}
                            </motion.div>

                            {/* Title */}
                            <h3 className="mt-6 text-4xl font-semibold text-black group-hover:bg-primary transition">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-gray-600 max-w-xs text-xl">{item.desc}</p>

                            {/* Underline accent */}
                            <span className="mt-4 block h-[2px] w-12 bg-primary/70 rounded-full opacity-0 group-hover:opacity-100 transition" />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
