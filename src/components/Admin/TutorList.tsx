/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useTutors, useDeleteTutor } from "../../hooks/useTutors";
import AddTutorDialog from "./AddTutorDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    UserPlus,
    Mail,
    BookOpen,
    Users,
    Loader2,
    Filter,
    Grid3X3,
    List
} from "lucide-react";
import EditTutorDialog from "./EditTutor";
import { useSubjects } from "@/hooks/useSubjects";
import { normalizeArray } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TutorList = () => {
    const { data: tutors, isLoading } = useTutors();
    const { data: allSubjects = [], isLoading: isFetchingSubject } = useSubjects();
    const router = useRouter()

    const deleteTutor = useDeleteTutor();
    const [editingTutor, setEditingTutor] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tutorToDelete, setTutorToDelete] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredTutors = React.useMemo(() => {
        if (!Array.isArray(tutors)) return [];

        return tutors.filter((tutor: any) => {
            const matchesSearch = tutor.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.subjects?.some((subject: string) =>
                    subject.toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesStatus = filterStatus === 'all' || tutor.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [tutors, searchTerm, filterStatus]);

    const handleDeleteClick = (tutor: any) => {
        setTutorToDelete(tutor);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (tutorToDelete) {
            console.log("tutorToDelete", tutorToDelete)
            deleteTutor.mutate(tutorToDelete.uid);
            setDeleteDialogOpen(false);
            setTutorToDelete(null);
        }
    };

    if (isLoading || isFetchingSubject) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading tutors...</p>
                </div>
            </div>
        );
    }
    const normalizeSubject = normalizeArray(allSubjects || [], "id")
    return (
        <div className="space-y-8 p-6 bg-white min-h-dvh">
            <EditTutorDialog open={!!editingTutor} onClose={() => setEditingTutor(null)} tutor={editingTutor} />
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-black ">
                            Tutors Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and organize your tutoring team
                        </p>
                    </div>
                    <AddTutorDialog
                        trigger={
                            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary ">
                                <UserPlus className="h-5 w-5" />
                                Add New Tutor
                            </Button>
                        }
                    />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-primary/10 text-black border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Tutors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Users className="h-8 w-8" />
                                <span className="text-3xl font-bold">{tutors?.length || 0}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/15  text-black border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Active Tutors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                </div>
                                <span className="text-3xl font-bold">
                                    {tutors?.filter((t: any) => t.status === 'active').length || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/15 text-black border-0 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Assigned Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-8 w-8" />
                                <span className="text-3xl font-bold">
                                    {new Set(tutors?.flatMap((t: any) => t.subjects || [])).size || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tutors, subjects, or emails..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white border-0 shadow-sm"
                                />
                            </div>

                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                                        <Button onClick={(e) => e.stopPropagation()} variant="outline" className="gap-2 bg-white shadow-sm">
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

                                <div className="flex bg-muted rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="gap-1"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="gap-1"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tutors Display */}
            {filteredTutors.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            <Users className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No tutors found</h3>
                        <p className="text-muted-foreground text-center mb-6">
                            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first tutor to the system'}
                        </p>
                        {!searchTerm && (
                            <AddTutorDialog
                                trigger={
                                    <Button className="gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Add First Tutor
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTutors.map((tutor: any) => (
                        <Card onClick={() => router.push(`/admin/tutors/${tutor.uid}`)} key={tutor.uid} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-black font-semibold text-lg">
                                            {tutor.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                                {tutor.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={tutor.status === 'active' ? 'default' : 'secondary'} className="text-xs text-white">
                                                    {tutor.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                                            <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingTutor(tutor)
                                            }} className="gap-2">
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(tutor)
                                                }}
                                                className="gap-2 text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span className="truncate">{tutor.email}</span>
                                </div>

                                {tutor.subjects && tutor.subjects.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <BookOpen className="h-4 w-4" />
                                            {normalizeSubject?.[tutor.subjects?.[0]]?.name}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-4 font-medium">Tutor</th>
                                        <th className="text-left p-4 font-medium">Email</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Subjects</th>
                                        <th className="text-right p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTutors.map((tutor: any) => (
                                        <tr onClick={() => router.push(`/admin/tutors/${tutor.uid}`)} key={tutor.uid} className="border-b hover:bg-muted/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                                                        {tutor.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{tutor.displayName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{tutor.email}</td>
                                            <td className="p-4">
                                                <Badge variant={tutor.status === 'active' ? 'default' : 'secondary'}>
                                                    {tutor.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {tutor.subjects?.slice(0, 2).map((subject: string) => (
                                                        <Badge key={subject} variant="outline" className="text-xs">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                    {(tutor.subjects?.length || 0) > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{(tutor.subjects?.length || 0) - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setEditingTutor(tutor)} className="gap-2">
                                                                <Edit className="h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(tutor)}
                                                                className="gap-2 text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )
            }

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete{' '}
                            <strong>{tutorToDelete?.displayName}</strong> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteTutor.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Tutor'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
};

export default TutorList;