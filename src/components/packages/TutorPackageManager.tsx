/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Tag, Clock, Package, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTutorInput } from "@/lib/schemas/tutorSchema";

export default function TutorPackageManager() {
    const { control, register, formState: { errors } } = useFormContext<AddTutorInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "paidLessons" as 'paidLessons',
    });

    const hasPackages = fields.length > 0;

    return (
        <Card className="max-w-full w-full border p-4 mx-auto rounded-xl bg-white shadow-sm">
            <CardHeader className="p-0 pb-4 border-b">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                    <DollarSign className="h-6 w-6 text-primary" />
                    Lesson Packages & Pricing
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4">

                {/* Package List */}
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-slate-50 flex flex-col gap-3 relative">
                            {/* Delete Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>

                            <h4 className="text-md font-bold text-slate-800">Package #{index + 1}</h4>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-1">
                                    <Label htmlFor={`paidLessons.${index}.name`}>Package Name</Label>
                                    <Input
                                        id={`paidLessons.${index}.name`}
                                        placeholder="e.g., Standard 60 min"
                                        {...register(`paidLessons.${index}.name` as const)}
                                    />
                                    {errors.paidLessons?.[index]?.name && <p className="text-xs text-red-500">{errors.paidLessons[index].name.message}</p>}
                                </div>
                                {/* Duration */}
                                <div className="space-y-1">
                                    <Label htmlFor={`paidLessons.${index}.duration`}>Duration (min)</Label>
                                    <Input
                                        id={`paidLessons.${index}.duration`}
                                        type="number"
                                        placeholder="60"
                                        {...register(`paidLessons.${index}.duration` as const, { valueAsNumber: true })}
                                    />
                                    {errors.paidLessons?.[index]?.duration && <p className="text-xs text-red-500">{errors.paidLessons[index].duration.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Price */}
                                <div className="space-y-1">
                                    <Label htmlFor={`paidLessons.${index}.price`}>Price per Session ($)</Label>
                                    <Input
                                        id={`paidLessons.${index}.price`}
                                        type="number"
                                        step="0.01"
                                        placeholder="50.00"
                                        {...register(`paidLessons.${index}.price` as const, { valueAsNumber: true })}
                                    />
                                    {errors.paidLessons?.[index]?.price && <p className="text-xs text-red-500">{errors.paidLessons[index].price.message}</p>}
                                </div>
                                {/* Credits in Package */}
                                <div className="space-y-1">
                                    <Label htmlFor={`paidLessons.${index}.credits`}>Credits in Package</Label>
                                    <Input
                                        id={`paidLessons.${index}.credits`}
                                        type="number"
                                        placeholder="1"
                                        defaultValue={1}
                                        {...register(`paidLessons.${index}.credits` as const, { valueAsNumber: true })}
                                    />
                                    {errors.paidLessons?.[index]?.credits && <p className="text-xs text-red-500">{errors.paidLessons[index].credits.message}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                <div className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: '', duration: 60, price: 50.00, credits: 1 })}
                        className="w-full gap-2 text-primary border-primary hover:bg-primary/5"
                    >
                        <Plus className="w-4 h-4" /> Add New Package
                    </Button>
                </div>

                {!hasPackages && (
                    <div className="text-center p-8 bg-slate-50 rounded-lg">
                        <Package className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600">No packages defined. Click above to get started.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}