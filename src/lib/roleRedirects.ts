/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/roleRedirects.ts

export const roleRedirects: Record<any, string> = {
    admin: "/admin/dashboard",
    tutor: "/tutor/dashboard",
    student: "/student/dashboard",
    none: "/login",
};
