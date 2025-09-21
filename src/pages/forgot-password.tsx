/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

// Define the form schema
const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address."),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<ForgotPasswordInput>({
            resolver: zodResolver(forgotPasswordSchema),
        });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            await sendPasswordResetEmail(auth, data.email);
            toast.success("Password reset link sent! Check your email.");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error.message || "Failed to send reset email. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md p-6 shadow-xl rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Forgot Password
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-2">
                        Enter your email to receive a password reset link.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
                <div className="text-center mt-4">
                    <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Log In
                    </Link>
                </div>
            </Card>
        </div>
    );
}