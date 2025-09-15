import React from "react";
import { motion } from "framer-motion";

interface FloatingWhatsAppButtonProps {
    phone: string; // international format e.g. "919876543210" (no + sign)
    message?: string; // default prefilled message
    label?: string; // optional label next to the button
    size?: number; // px size of the circular button
    position?: "bottom-right" | "bottom-left" | "bottom-center";
    newTab?: boolean; // open in new tab
}

function normalizePhone(phone: string) {
    // Remove spaces, +, hyphens, parentheses
    return phone?.replace(/[^0-9]/g, "");
}

function buildWhatsAppUrl(phone: string, message?: string) {
    const normalized = normalizePhone(phone);
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${normalized}${text}`;
}

export default function FloatingWhatsAppButton({
    phone,
    message = "Hi! I would like to book a demo.",
    label = "Chat on WhatsApp",
    size = 56,
    position = "bottom-right",
    newTab = true,
}: FloatingWhatsAppButtonProps) {
    const href = buildWhatsAppUrl(phone, message);

    const posClass =
        position === "bottom-left"
            ? "left-4"
            : position === "bottom-center"
                ? "left-1/2 transform -translate-x-1/2"
                : "right-4"; // bottom-right default

    return (
        <div
            aria-hidden={false}
            className={`fixed bottom-6 ${posClass} z-50 flex items-center gap-3`}
        >
            {/* Optional label (hidden on very small screens) */}
            <motion.a
                href={href}
                target={newTab ? "_blank" : "_self"}
                rel="noreferrer noopener"
                className="hidden sm:inline-flex items-center rounded-full bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md border border-neutral-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-label={label}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    className="mr-2"
                    aria-hidden
                >
                    <path
                        fill="#25D366"
                        d="M12.03 2C6.48 2 2 6.48 2 12c0 1.96.51 3.78 1.4 5.38L2 22l4.78-1.25A9.95 9.95 0 0012.03 22c5.52 0 10.02-4.48 10.02-10S17.55 2 12.03 2z"
                    />
                    <path
                        fill="#fff"
                        d="M17.6 14.2c-.3-.15-1.75-.85-2.02-.95-.27-.1-.47-.15-.67.15s-.77.95-.95 1.15c-.17.2-.35.2-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2 0-.38-.02-.53-.02-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.53.07-.82.38-.3.3-1.15 1.12-1.15 2.72 0 1.6 1.18 3.15 1.35 3.37.17.22 2.32 3.6 5.63 4.9 3.3 1.3 3.3.87 3.9.82.6-.05 1.95-.8 2.23-1.56.27-.76.27-1.4.19-1.55-.08-.15-.27-.22-.57-.37z"
                    />
                </svg>
                <span className="text-sm font-medium text-neutral-900">{label}</span>
            </motion.a>

            {/* Floating circular button */}
            <motion.a
                href={href}
                target={newTab ? "_blank" : "_self"}
                rel="noreferrer noopener"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full shadow-lg"
                style={{ width: size, height: size }}
                aria-label={`Open WhatsApp chat with ${phone}`}
            >
                <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: size, height: size, background: "#25D366" }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={Math.round(size * 0.55)}
                        height={Math.round(size * 0.55)}
                        aria-hidden
                    >
                        <path
                            fill="#ffffff"
                            d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 .001 5.373 0 12c0 2.11.55 4.12 1.6 5.9L0 24l6.3-1.66A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.5c-1.4 0-2.78-.36-4-1.05l-.28-.14-3.74.99.99-3.65-.16-.29A8.5 8.5 0 013.5 12 8.5 8.5 0 1112 21.5z"
                        />
                        <path
                            fill="#ffffff"
                            d="M17.5 14.1c-.3-.15-1.75-.85-2.02-.95-.27-.1-.47-.15-.67.15s-.77.95-.95 1.15c-.17.2-.35.2-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2 0-.38-.02-.53-.02-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.53.07-.82.38-.3.3-1.15 1.12-1.15 2.72 0 1.6 1.18 3.15 1.35 3.37.17.22 2.32 3.6 5.63 4.9 3.3 1.3 3.3.87 3.9.82.6-.05 1.95-.8 2.23-1.56.27-.76.27-1.4.19-1.55-.08-.15-.27-.22-.57-.37z"
                        />
                    </svg>
                </div>
            </motion.a>
        </div>
    );
}
