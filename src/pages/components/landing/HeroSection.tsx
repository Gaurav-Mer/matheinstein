import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bag } from "@/components/svgs/students";
import { Add, Divide, Hero, Message, Multiply } from "@/components/svgs/teachers";
import BookDemoDialog from "../dialogs/BookDemoDialog";

const HeroSection = () => {
    const [openDialog, setOpenDialog] = React.useState(false);
    return (
        <section className="relative overflow-hidden bg-white  py-10 px-6 md:px-12 h-full">
            <BookDemoDialog open={openDialog} onClose={() => setOpenDialog(false)} />
            {/* Background decorative elements */}

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                {/* Left side: Text content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="space-y-4 relative">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-800 relative">
                            Live 1-to-1
                            <span className="bg-primary text-white inline-block transform -rotate-1 px-2 py-1 rounded">
                                Visual Math
                            </span>

                            Classes

                        </h1>
                        <div className="absolute -top-7 left-1/2 transform translate-x-1/2 flex items-center gap-2">
                            <Message className="h-12 w-12" />
                        </div>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>

                    <p className="text-xl text-slate-600 leading-relaxed max-w-lg ">
                        Transform math learning with engaging, interactive visual classes designed for <span className="text-primary font-bold">Grades 1–8</span>.
                        Build confidence and strong foundations through personalized teaching.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="#book-demo" >
                            <Button
                                // onClick={() => setOpenDialog(true)}
                                size="lg"
                                className="bg-primary text-black border-black border-2 font-semibold py-6 px-8  transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Book Free Demo Class
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-black hover:border-primary text-slate-700 hover:text-primary font-semibold py-6 px-8 rounded-xl transition-all duration-300"
                        >
                            Explore Curriculum
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center gap-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-600">1000+ Happy Students</span>
                        </div>
                        <div className="text-slate-300">|</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-600">Expert Teachers</span>
                        </div>
                    </div>
                </motion.div>
                {/* Right side: Hero Image with clean design */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative flex justify-center lg:justify-end"
                >
                    <SVGLINE />
                    {/* <SECONDSVG /> */}
                    <div className="relative">
                        {/* Main image container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        // className="relative bg-secondary/20 rounded-4xl rotate-6 shadow-2xl p-6"
                        >
                            <Image
                                src="/hero.png"
                                alt="Interactive Math Learning Visual"
                                height={500}
                                width={500}
                                className="rounded-xl -rotate-6 md:block hidden"
                            />
                            {/* <Hero /> */}
                        </motion.div>

                        {/* Floating math elements - subtle and professional */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-4 -left-4 bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg font-bold text-xl"
                        >
                            <Add className="h-6" />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 10, 0],
                                rotate: [0, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            className="absolute top-8 -right-6 bg-secondary text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg font-bold text-lg"
                        >
                            <Multiply className="h-6" />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 3, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                            className="absolute bottom-12 -left-6 bg-secondary text-white w-11 h-11 rounded-xl flex items-center justify-center shadow-lg font-bold text-lg"
                        >
                            <Divide className="h-6" />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 12, 0],
                                rotate: [0, -3, 0]
                            }}
                            transition={{
                                duration: 4.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1.5
                            }}
                            className="absolute -bottom-2 right-4 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg font-bold text-xl"
                        >
                            <Bag />
                        </motion.div>

                        {/* Subtle grid pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="w-full h-full" style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px'
                            }}></div>
                        </div>
                    </div>
                </motion.div>
            </div >
        </section >
    );
};

export default HeroSection;



const SVGLINE = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 220" preserveAspectRatio="none" className="w-full absolute -top-20 -rotate-12 right-0">
            <path d="M 0 120 C 140 40 260 200 420 120 C 580 40 700 200 860 120 C 1020 40 1140 200 1400 120"
                fill="none" stroke="#F3F4F6" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
            <path d="M 0 120 C 140 40 260 200 420 120 C 580 40 700 200 860 120 C 1020 40 1140 200 1400 120"
                fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="140" cy="40" r="6" fill="#F59E0B" />
            <circle cx="420" cy="120" r="6" fill="#F59E0B" />
            <circle cx="700" cy="200" r="6" fill="#F59E0B" />
            <circle cx="980" cy="120" r="6" fill="#F59E0B" />
            <circle cx="1160" cy="200" r="6" fill="#F59E0B" />
            <text x="120" y="12" font-size="26" fill="#111827" font-family="Inter, system-ui, sans-serif" opacity="0.85">∑</text>
            <text x="380" y="200" font-size="20" fill="#111827" font-family="Inter, system-ui, sans-serif" opacity="0.85">π</text>
            <text x="680" y="26" font-size="20" fill="#111827" font-family="Inter, system-ui, sans-serif" opacity="0.85">√</text>
            <text x="980" y="28" font-size="20" fill="#111827" font-family="Inter, system-ui, sans-serif" opacity="0.85">÷</text>
        </svg>

    )
}

const SECONDSVG = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1400 220"
            preserveAspectRatio="none"
            className="w-full h-60 scale-125 absolute -top-40 -rotate-12 z-10"
        >
            {/* Background soft curve */}
            <path
                d="M 0 140 C 180 60 320 200 500 140 C 680 80 880 200 1100 140 C 1260 80 1400 160 1400 160"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
            />
            {/* Secondary subtle curve */}
            <path
                d="M 0 160 C 200 100 400 220 620 160 C 840 100 1040 220 1260 160 C 1350 140 1400 180 1400 180"
                fill="none"
                stroke="url(#grad2)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
            />

            {/* Gradient defs */}
            <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
            </defs>

            {/* Elegant math symbols placed along the curve */}
            <text x="120" y="80" fontSize="20" fill="#111827" opacity="0.9">∑</text>
            <text x="360" y="180" fontSize="20" fill="#111827" opacity="0.9">π</text>
            <text x="680" y="90" fontSize="22" fill="#111827" opacity="0.9">√</text>
            <text x="980" y="160" fontSize="20" fill="#111827" opacity="0.9">÷</text>
            <text x="1240" y="100" fontSize="22" fill="#111827" opacity="0.9">∞</text>

            {/* Subtle glowing circles as anchor points */}
            <circle cx="180" cy="60" r="4" fill="#F59E0B" opacity="0.7" />
            <circle cx="500" cy="140" r="4" fill="#EF4444" opacity="0.7" />
            <circle cx="880" cy="200" r="4" fill="#3B82F6" opacity="0.7" />
            <circle cx="1260" cy="160" r="4" fill="#8B5CF6" opacity="0.7" />
        </svg>

    )
}