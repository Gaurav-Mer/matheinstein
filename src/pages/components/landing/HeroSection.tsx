import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bag } from "@/components/svgs/students";
import { Add, Divide, Hero, Message, Multiply } from "@/components/svgs/teachers";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-white  py-10 px-6 md:px-12 h-full">
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
                        <Button
                            size="lg"
                            className="bg-primary text-black border-black border-2 font-semibold py-6 px-8  transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Book Free Demo Class
                        </Button>
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
                    <div className="relative">
                        {/* Main image container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        // className="relative bg-secondary/20 rounded-4xl rotate-6 shadow-2xl p-6"
                        >
                            {/* <Image
                                src="/hero.jpg"
                                alt="Interactive Math Learning Visual"
                                height={450}
                                width={450}
                                className="rounded-xl -rotate-6"
                            /> */}
                            <Hero />
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

