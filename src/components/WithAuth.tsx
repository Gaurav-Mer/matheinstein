/* eslint-disable @typescript-eslint/no-explicit-any */
// /components/WithAuth.tsx
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth, Role } from "@/hooks/useAuth";

interface WithAuthProps {
    children: ReactNode;
    allowedRoles?: Role[]; // optional: restrict access
}

export function WithAuth({ children, allowedRoles }: WithAuthProps) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    // Role → Dashboard mapping
    const roleRedirects: Record<any, any> = {
        admin: "/admin/dashboard",
        tutor: "/tutor/dashboard",
        student: "/student/dashboard",
        none: "/login", // fallback
    };

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // 🚨 Not logged in → login
                router.replace("/login");
            } else if (allowedRoles && !allowedRoles.includes(role)) {
                const modifiedRole = role ? role : "none";
                // 🚨 Logged in but unauthorized → redirect to their own dashboard
                const target = roleRedirects[modifiedRole];
                router.replace(target);
            }
        }
    }, [loading, user, role, allowedRoles, router]);

    if (loading) return <div className="p-4">Loading...</div>;

    // If user is not logged in → show nothing (redirect handled above)
    if (!user) return null;

    // If role not allowed → don’t render children (redirect handled above)
    if (allowedRoles && !allowedRoles.includes(role)) return null;

    return <>{children}</>;
}
