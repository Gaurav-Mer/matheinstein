/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import { useSubjects, useAddSubject, useUpdateSubject, useDeleteSubject } from "@/hooks/useSubjects";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    BookOpen,
    Check,
    X,
    Loader2,
    Search,
    Filter
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Schemas
const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required").max(50, "Subject name too long"),
    status: z.enum(["active", "inactive"]),
});

type SubjectInput = z.infer<typeof subjectSchema>;

// Types
interface EditState {
    id: string;
    name: string;
    status: "active" | "inactive";
}

export default function SubjectsSection() {
    const { data: subjects = [], isLoading } = useSubjects();
    const addSubject = useAddSubject();
    const updateSubject = useUpdateSubject();
    const deleteSubject = useDeleteSubject();

    // State management - consolidated into single objects
    const [dialogs, setDialogs] = useState({
        add: false,
        delete: false,
    });

    const [editState, setEditState] = useState<EditState | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

    // Form for Add/Edit Subject
    const form = useForm<SubjectInput>({
        resolver: zodResolver(subjectSchema),
        defaultValues: { name: "", status: "active" },
    });

    const editForm = useForm<SubjectInput>({
        resolver: zodResolver(subjectSchema),
    });

    // Filter subjects
    const filteredSubjects = subjects.filter((subject: any) => {
        const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || subject.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Add subject handler
    const handleAddSubmit = (data: SubjectInput) => {
        addSubject.mutate(data, {
            onSuccess: () => {
                toast.success("Subject added successfully!");
                form.reset();
                setDialogs(prev => ({ ...prev, add: false }));
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to add subject");
            },
        });
    };

    // Edit handlers
    const startEdit = (subject: any) => {
        const editData = { id: subject.id, name: subject.name, status: subject.status };
        setEditState(editData);
        editForm.reset({ name: subject.name, status: subject.status });
    };

    const handleEditSubmit = (data: SubjectInput) => {
        if (!editState) return;

        updateSubject.mutate(
            { id: editState.id, ...data, status: editForm?.watch().status },
            {
                onSuccess: () => {
                    toast.success("Subject updated successfully!");
                    setEditState(null);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.error || "Failed to update subject");
                },
            }
        );
    };

    const cancelEdit = () => {
        setEditState(null);
        editForm.reset();
    };

    // Delete handlers
    const startDelete = (subject: any) => {
        setDeleteTarget(subject);
        setDialogs(prev => ({ ...prev, delete: true }));
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        deleteSubject.mutate(deleteTarget.id, {
            onSuccess: () => {
                toast.success("Subject deleted successfully!");
                setDialogs(prev => ({ ...prev, delete: false }));
                setDeleteTarget(null);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to delete subject");
            },
        });
    };

    const cancelDelete = () => {
        setDialogs(prev => ({ ...prev, delete: false }));
        setDeleteTarget(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading subjects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6  min-h-dvh ">
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-black">
                            Subjects Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Organize and manage your teaching subjects
                        </p>
                    </div>

                    <Dialog open={dialogs.add} onOpenChange={(open) => setDialogs(prev => ({ ...prev, add: open }))}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary hover:bg-secondary">
                                <Plus className="h-5 w-5" />
                                Add New Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Add New Subject
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="add-name">Subject Name *</Label>
                                    <Input
                                        id="add-name"
                                        placeholder="e.g., Mathematics, Physics, English"
                                        {...form.register("name")}
                                        className={form.formState.errors.name ? "border-red-500" : ""}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status *</Label>
                                    <Select
                                        value={form.watch("status")}
                                        onValueChange={(value: "active" | "inactive") => form.setValue("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <DialogFooter className="gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogs(prev => ({ ...prev, add: false }))}
                                        disabled={addSubject.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={addSubject.isPending} className="gap-2">
                                        {addSubject.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                Add Subject
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats and Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-secondary/20 text-black border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-8 w-8" />
                                <span className="text-3xl font-bold">{subjects.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/20 text-black border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Active Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-black"></div>
                                </div>
                                <span className="text-3xl font-bold">
                                    {subjects.filter((s: any) => s.status === 'active').length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/20 text-black border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Inactive Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <X className="h-4 w-4" />
                                </div>
                                <span className="text-3xl font-bold">
                                    {subjects.filter((s: any) => s.status === 'inactive').length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search subjects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white border-0 shadow-sm"
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-white shadow-sm">
                                        <Filter className="h-4 w-4" />
                                        {filterStatus === 'all' ? 'All Status' :
                                            filterStatus === 'active' ? 'Active' : 'Inactive'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                        All Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                                        Active Only
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                                        Inactive Only
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subjects List */}
            {filteredSubjects.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No subjects found</h3>
                        <p className="text-muted-foreground text-center mb-6">
                            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first subject'}
                        </p>
                        {!searchTerm && (
                            <Button
                                onClick={() => setDialogs(prev => ({ ...prev, add: true }))}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add First Subject
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {filteredSubjects.map((subject: any) => (
                                <div
                                    key={subject.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-all duration-200 hover:shadow-md"
                                >
                                    {editState?.id === subject.id ? (
                                        // Edit mode
                                        <form
                                            onSubmit={editForm.handleSubmit(handleEditSubmit)}
                                            className="flex items-center gap-3 flex-1"
                                        >
                                            <Input
                                                {...editForm.register("name")}
                                                className="flex-1"
                                                autoFocus
                                            />
                                            <Select
                                                value={editForm.watch("status")}
                                                onValueChange={(value: "active" | "inactive") => editForm.setValue("status", value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={updateSubject.isPending}
                                                    className="gap-1"
                                                >
                                                    {updateSubject.isPending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={cancelEdit}
                                                    disabled={updateSubject.isPending}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        // View mode
                                        <>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                                                    {subject.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{subject.name}</h3>
                                                    <Badge
                                                        variant={subject.status === 'active' ? 'default' : 'secondary'}
                                                        className="mt-1 text-white"
                                                    >
                                                        {subject.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => startEdit(subject)}
                                                        className="gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => startDelete(subject)}
                                                        className="gap-2 text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={dialogs.delete} onOpenChange={(open) => !open && cancelDelete()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>&quot;{deleteTarget?.name}&quot;</strong>? This action cannot be undone and will remove this subject from all associated tutors.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete} disabled={deleteSubject.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={deleteSubject.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteSubject.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Subject
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}