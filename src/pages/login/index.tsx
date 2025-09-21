'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { Loader2 } from 'lucide-react';
import { auth, firestore } from '@/lib/firebaseClient';
import { toast } from 'react-toastify';
import Image from 'next/image'


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch role from Firestore
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) throw new Error("User role not found.");

            const role = userDoc.data().role as "admin" | "tutor" | "student";

            // Role → Dashboard mapping
            const roleRedirects: Record<typeof role, string> = {
                admin: "/admin/dashboard",
                tutor: "/tutor/dashboard",
                student: "/student/dashboard",
            };

            // ✅ Redirect user after login
            router.push(roleRedirects[role]);
        } catch (error) {
            console.error("Login failed:", error);
            let description = "Please check your email and password.";
            if (error instanceof Error && error.message.includes("offline")) {
                description = "Could not connect to the server. Please check your internet connection.";
            }
            toast(description, { type: "error" });
            setIsLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="items-center text-center">
                    <div className='flex items-center justify-center'>
                        <Image src={"/matheinstein.png"} width={80} height={80} alt='Logo' />
                    </div>
                    <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to sign in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
