"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FloatingPlus = () => {
    const [shape, setShape] = useState<"plus" | "minus" | "x">("plus");

    const shapeVariants = {
        plus: {
            horizontal: { rotate: 0, opacity: 1, scale: 1 },
            vertical: { rotate: 0, opacity: 1, scale: 1 },
        },
        minus: {
            horizontal: { rotate: 0, opacity: 1, scale: 1.2 },
            vertical: { opacity: 0, scale: 0.1 },
        },
        x: {
            horizontal: { rotate: 45, opacity: 1, scale: 1.2 },
            vertical: { rotate: -45, opacity: 1, scale: 1.2 },
        },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setShape((prev) => (prev === "plus" ? "minus" : prev === "minus" ? "x" : "plus"));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute -top-12 -right-52 z-50">
            <div className="relative h-64 w-64 flex items-center justify-center">
                {/* Ambient Glow */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    style={{ filter: "blur(25px)", zIndex: -1 }}
                />

                {/* Main Symbol Container */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotateX: [0, 10, -10, 0],
                        rotateY: [0, -10, 10, 0],
                    }}
                    transition={{
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                        rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="relative h-32 w-32 flex items-center justify-center cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Symbol's Horizontal Bar */}
                    <motion.div
                        animate={shapeVariants[shape].horizontal}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute h-10 w-28 rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, #FEA405 0%, #FEA405 100%)",
                            boxShadow: "0 0 10px #FEA405, inset 0 0 8px #FEA405",
                        }}
                    >
                        <div className="absolute inset-0 rounded-xl bg-white/10" style={{ backdropFilter: "blur(1px)" }} />
                    </motion.div>

                    {/* Symbol's Vertical Bar */}
                    <motion.div
                        animate={shapeVariants[shape].vertical}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute h-28 w-10 rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, #FEA405 0%, #FEA405 100%)",
                            boxShadow: "0 0 10px #FEA405, inset 0 0 8px #d1d5db",
                        }}
                    >
                        <div className="absolute inset-0 rounded-xl bg-white/10" style={{ backdropFilter: "blur(1px)" }} />
                    </motion.div>
                </motion.div>

                {/* The Floating Shadow */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="absolute bottom-10 h-10 w-24 rounded-full bg-primary"
                    style={{ filter: "blur(18px)", zIndex: -1 }}
                />
            </div>
        </div>
    );
};

export default FloatingPlus;