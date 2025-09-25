/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import {
    LayoutDashboard, Users, GraduationCap, CalendarDays, BookOpen,
    Settings, LogOut, Home, MessageSquare, Plus, DollarSign, Crown,
    Clock, Bell, User, Menu, X, Puzzle, ShoppingCart
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Define navigation by role
const navLinks = {
    public: [
        { label: "Home", href: "/", icon: Home },
        { label: "Find a Tutor", href: "/tutors", icon: GraduationCap },
        { label: "Login", href: "/login", icon: LogOut },
    ],
    student: [
        { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { label: "Bookings", href: "/student/bookings", icon: CalendarDays },
        { label: "My Tutors", href: "/student/tutor", icon: GraduationCap },
        { label: "Buy Packages", href: "/student/packages", icon: ShoppingCart },
        // { label: "Messages", href: "/student/messages", icon: MessageSquare },
        { label: "Billings", href: "/student/billing", icon: DollarSign }
    ],
    tutor: [
        { label: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
        { label: "Availability", href: "/tutor/availability", icon: Clock },
        { label: "My Students", href: "/tutor/students", icon: Users },
        { label: "Bookings", href: "/tutor/bookings", icon: CalendarDays },
        // { label: "Earnings", href: "/tutor/earnings", icon: DollarSign },
    ],
    admin: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Tutors", href: "/admin/tutors", icon: GraduationCap },
        { label: "Students", href: "/admin/students", icon: Users },
        { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
        { label: "Subjects", href: "/admin/subjects", icon: BookOpen },
        { label: "Admins", href: "/admin/admins", icon: Crown },
        { label: "Apps & Integrations", href: "/admin/apps-and-integrations", icon: Puzzle },
        { label: "Settings", href: "/admin/settings", icon: Settings },
        { label: "Profile", href: "/admin/profile", icon: User },
        { label: "Demo Requests", href: "/admin/demo-requests", icon: Bell },
        { label: "Invite Admin", href: "/admin/invite-admin", icon: Plus },
        { label: "Billings", href: "/admin/purchases", icon: DollarSign }
    ],
};

const Sidebar = () => {
    const pathname = usePathname();
    const { user, role, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const links = user ? navLinks[role as keyof typeof navLinks] || [] : navLinks.public;

    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b">
                <Image
                    src="/matheinstein.png"
                    width={32}
                    height={32}
                    alt="MathEinstein"
                    className="rounded-lg"
                />
                <span className="text-xl font-bold text-slate-900">MathEinstein</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
                <ul className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');

                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/20 text-primary"
                                            : "text-slate-700 hover:bg-primary/10 hover:text-slate-900"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section & Logout */}
            {user && (
                <div className="border-t border-slate-100 p-6">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {user.displayName?.charAt(0) || user.email?.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                                {role || 'Student'}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Mobile Toggle */}
            <button
                onClick={toggleMobileSidebar}
                className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg  border border-slate-200"
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 ",
                "transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out",
                isMobileOpen && "translate-x-0"
            )}>
                <SidebarContent />
            </aside>

            {/* Desktop Spacer */}
            <div className="hidden md:block w-64" />
        </>
    );
};

export default Sidebar;