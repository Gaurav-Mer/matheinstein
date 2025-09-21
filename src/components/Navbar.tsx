// components/Navbar.tsx
"use client"
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // your auth hook
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'

const ignore = ["/login", "/"]
export default function Navbar() {
    const { user, role, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathName = usePathname();

    // Define navigation by role
    const navLinks: Record<string, { label: string; href: string }[]> = {
        public: [
            { label: "Home", href: "/" },
            { label: "Find a Tutor", href: "/tutors" },
            { label: "Login", href: "/login" },
            // { label: "Sign Up", href: "/register" },
        ],
        student: [
            { label: "Dashboard", href: "/student/dashboard" },
            { label: "My Tutors", href: "/student/tutors" },
            { label: "Bookings", href: "/student/bookings" },
        ],
        tutor: [
            { label: "Dashboard", href: "/tutor/dashboard" },
            { label: "My Students", href: "/tutor/students" },
            { label: "Availability", href: "/tutor/availability" },
            { label: "Bookings", href: "/tutor/bookings" },
        ],
        admin: [
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Tutors", href: "/admin/tutors" },
            { label: "Students", href: "/admin/students" },
            { label: "Settings", href: "/admin/settings" },
            { label: "Subjects", href: "/admin/subjects" },
        ],
    };

    // Pick role links
    const links = user ? navLinks[role ?? "student"] : navLinks.public;

    const onLogut = () => {
        logout();
        router.replace("/login")
    }

    if (ignore.includes(pathName)) return null
    return (
        <nav className="bg-white border-b  sticky top-0 z-50">
            <div className="max-w-full px-12">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Image src={"/matheinstein.png"} width={80} height={80} alt='Logo' />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center font-sans font-medium">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-primary font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={logout}
                                className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t shadow-md">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <button
                            onClick={onLogut}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
