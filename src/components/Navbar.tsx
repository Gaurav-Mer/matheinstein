"use client"
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // your auth hook
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, User } from "lucide-react";
import { Button } from "./ui/button";

const ignore = ["/login", "/"]
export default function Navbar() {
    const { user, role, logout } = useAuth();
    const router = useRouter();
    const pathName = usePathname();

    const onLogut = () => {
        logout();
        router.replace("/login")
    }

    // A mapping of role to profile URL
    const getProfileHref = () => {
        if (!role) return "/";
        switch (role) {
            case "admin":
                return "/admin/profile";
            case "tutor":
                return "/tutor/profile";
            case "student":
                return "/student/profile";
            default:
                return "/";
        }
    };

    if (ignore.includes(pathName) || !user) return null

    const moveToHome = () => {
        console.log("role", role)
        if (!role) return "/";
        switch (role) {
            case "admin":
                return router.push("/admin/dashboard");
            case "tutor":
                return router.push("/tutor/dashboard");
            case "student":
                return router.push("/student/dashboard");
            default:
                return "/";
        }
    }
    return (
        <nav className="bg-white border-b shrink-0 z-50">
            <div className="max-w-full px-12">
                <div className="flex justify-between  items-center h-20">
                    {/* Logo and Sidebar Toggle */}
                    <div className="flex items-center gap-4">
                        <div onClick={moveToHome} className="flex-shrink-0 flex items-center">
                            <Image src={"/matheinstein.png"} width={80} height={80} alt='Logo' />
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/avatar.png" alt="User Avatar" />
                                        <AvatarFallback>
                                            {user?.email?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.displayName || role}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={getProfileHref()} className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogut} className="flex items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}