/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Clock, Tag, MessageSquare } from "lucide-react";
import { cn } from '@/lib/utils';

interface TutorSummaryCardProps {
    tutor: any;
    className?: string;
}

export default function TutorSummaryCard({ tutor, className }: TutorSummaryCardProps) {
    return (
        <Card className={cn("bg-white shadow-md rounded-xl", className)}>
            <CardHeader className="p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                        {tutor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <CardTitle className="text-xl">{tutor.name}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Tutor</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">About Me</p>
                    <p className="text-slate-700 leading-relaxed">{tutor.bio || "No bio provided."}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                        {tutor.subjects?.length > 0 ? (
                            tutor.subjects.map((sub: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">{sub}</Badge>
                            ))
                        ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100">No subjects listed</Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}