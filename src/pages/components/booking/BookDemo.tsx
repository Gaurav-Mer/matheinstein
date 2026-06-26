"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

// TutorCruncher Socket public key (public — safe to ship in the browser).
const SOCKET_KEY = "5d0cd2233e8842829636";

declare global {
    interface Window {
        socket?: (publicKey: string, config: Record<string, unknown>) => void;
    }
}

const BookDemo = () => {
    useEffect(() => {
        const SCRIPT_ID = "tutorcruncher-socket-script";
        const render = () => {
            window.socket?.(SOCKET_KEY, { mode: "enquiry", element: "#tc-socket-enquiry" });
        };

        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
            if (window.socket) render();
            else existing.addEventListener("load", render, { once: true });
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://cdn.tutorcruncher.com/socket/latest/socket.js";
        script.async = true;
        script.addEventListener("load", render, { once: true });
        document.body.appendChild(script);
    }, []);

    return (
        <div className="w-full p-4 mt-12" id="book-demo">
            {/* Heading */}
            <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-primary/15">
                    Get started
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Book your free demo
                </h2>
            </div>
            <motion.div className="max-w-4xl mx-auto text-center mt-12">
                <motion.p initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-3 text-lg leading-relaxed text-muted-foreground">Tell us about your child and we&apos;ll be in touch to book your slot.</motion.p>
                <div id="tc-socket-enquiry" className="mt-8 text-left"></div>
            </motion.div>
        </div>
    );
};

export default BookDemo;
