"use client";

import { Mail, Phone, Youtube, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {

    const arr = [{
        label: "About Us", href: "#about",
    }, {
        label: "Why Choose Us", href: "#whyus",
    }, {
        label: "Learning Path", href: "#path",
    }, {
        label: "Pricing / Plans", href: "#pricing",
    }, {
        label: "FAQ", href: "#faq",
    }]
    return (
        <footer className="bg-primary/10 border-t border-black/20 mt-16">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* 1. Branding & Tagline */}
                <div>
                    <h3 className="text-2xl font-bold">MathEinstein</h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Making Math Visual, Fun, and Easy for Classes 1–8.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-black  font-semibold text-sm">
                        ⭐ Trusted by 500+ Parents
                    </div>
                </div>

                {/* 2. Quick Navigation */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {arr.map((link, i) => (
                            <li key={i}>
                                <a href={link.href} className="hover:text-black transition">
                                    {link?.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Support & Contact */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4" /> mathEinstein@gmail.com
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                        <Phone className="w-4 h-4" /> +91 98765 43210
                    </p>
                    <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                        Contact Us
                    </button>
                    <p className="mt-2 text-xs text-gray-500">Mon–Fri, 9 AM – 6 PM IST</p>
                </div>

                {/* 4. Social Proof & Community */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Join Our Community</h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Follow us for daily math tips & tricks:
                    </p>
                    <div className="flex gap-4">
                        <a href="#" aria-label="YouTube">
                            <Youtube className="w-6 h-6 text-gray-600 hover:text-black transition" />
                        </a>
                        <a href="#" aria-label="Instagram">
                            <Instagram className="w-6 h-6 text-gray-600 hover:text-black transition" />
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <Linkedin className="w-6 h-6 text-gray-600 hover:text-black transition" />
                        </a>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 border border-black rounded">SSL Secure</span>
                        <span className="px-2 py-1 border border-black rounded">First Class Free</span>
                    </div>
                </div>
            </div>

            {/* 5. Legal & Policies Strip */}
            <div className="border-t border-black/10 py-4 text-center text-xs text-gray-500">
                {/* <div className="flex flex-col md:flex-row justify-center gap-4">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Refund / Cancellation Policy</a>
                </div> */}
                <p className="mt-2">© {new Date().getFullYear()} MathEinstein. All rights reserved.</p>
            </div>
        </footer>
    );
}
