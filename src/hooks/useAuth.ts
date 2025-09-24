/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auth, firestore } from "@/lib/firebaseClient";

export type Role = "admin" | "tutor" | "student" | null;

export function useAuth() {
    const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(undefined); // undefined = auth check in progress
    const queryClient = useQueryClient();

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user ?? null);

            // Clear cached user data if logged out
            if (!user) {
                queryClient.removeQueries({ queryKey: ["userProfile"] });
            }
        });

        return () => unsubscribe();
    }, [queryClient]);

    // Fetch user profile & role using TanStack Query
    const { data: userProfile, isLoading: profileLoading } = useQuery({
        queryKey: ["userProfile", firebaseUser?.uid],
        queryFn: async () => {
            if (!firebaseUser) throw new Error("No user logged in");

            const docSnap = await getDoc(doc(firestore, "users", firebaseUser.uid));
            if (!docSnap.exists()) throw new Error("User not found");

            return docSnap.data() as { role: Role; lessonCredits: number;[key: string]: any }; // ⬅️ Ensure lessonCredits is typed
        },
        enabled: !!firebaseUser, // only fetch if user is logged in
        staleTime: 1000 * 60 * 5, // ⬅️ Change to a limited time or remove entirely
        refetchOnWindowFocus: false,
    });

    // ✅ Logout function
    const logout = async () => {
        await signOut(auth);
        queryClient.removeQueries({ queryKey: ["userProfile"] });
        setFirebaseUser(null);
    };

    // loading is true only while auth check or profile fetching is in progress
    const loading = firebaseUser === undefined || profileLoading;

    return {
        user: firebaseUser ?? null,
        role: userProfile?.role ?? null,
        profile: userProfile ?? null,
        loading,
        logout,
        lessonCredits: userProfile?.lessonCredits ?? 0, // ⬅️ Export credits directly
    };
}
