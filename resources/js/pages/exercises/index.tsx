import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Search, 
    Filter,
    SortAsc,
    SortDesc,
    Plus
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exercise Database',
        href: '/exercises',
    },
];

interface Exercise {
    id: number;
    name: string;
    primary_muscle_group: {
        id: number;
        name: string;
    };
    equipment: {
        id: number;
        name: string;
    } | null;
    is_compound: boolean;
    muscle_groups?: Array<{
        id: number;
        name: string;
        pivot: { involvement: 'primary' | 'secondary' };
    }>;
}

interface MuscleGroup {
    id: number;
    name: string;
}

interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMeta {
    from: number;
    to: number;
    total: number;
    last_page: number;
    current_page: number;
    path: string;
    per_page: number;
}

interface Props {
    exercises: {
        data: Exercise[];
        links: PaginatedLink[];
        meta: PaginatedMeta;
    };
    muscleGroups: MuscleGroup[];
    filters: {
        search?: string;
        muscle_group?: string;
        equipment?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
}

type SortField = 'name' | 'primary_muscle_group' | 'equipment' | 'created_at';

export default function Index({ exercises, muscleGroups, filters: initialFilters }: Props) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        muscle_group: initialFilters.muscle_group || '',
        sort: (initialFilters.sort as SortField) || 'name',
        direction: initialFilters.direction || 'asc',
    });

    const debouncedRefetch = useDebouncedCallback((newFilters) => {
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([, value]) => value)
        );
        router.get('/exercises', cleanFilters as any, {
            preserveState: true,
            preserveScroll: true,
        });
    }, 300);

    useEffect(() => {
        debouncedRefetch(filters);
    }, [filters, debouncedRefetch]);

    const handleSort = (field: SortField) => {
        setFilters(prev => ({
            ...prev,
            sort: field,
            direction: prev.sort === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleMuscleGroupFilter = (muscleGroupId: string) => {
        setFilters(prev => ({ ...prev, muscle_group: muscleGroupId }));
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFilters(prev => ({ ...prev, search: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            muscle_group: '',
            sort: 'name',
            direction: 'asc',
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this exercise?')) {
            router.delete(`/exercises/${id}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <button
            onClick={() => handleSort(field)}
            className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
        >
            {children}
            {filters.sort === field && (
                filters.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
            )}
        </button>
    );

    const hasActiveFilters = filters.search || filters.muscle_group;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exercise Database" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Exercise Database</h2>
                        <p className="text-muted-foreground">
                            Manage your personal exercise library
                        </p>
                    </div>
                    <Link href="/exercises/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Exercise
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search exercises..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>

                        {/* Muscle Group Filter */}
                        <Select value={filters.muscle_group} onValueChange={handleMuscleGroupFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="All muscle groups" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Enter">All muscle groups</SelectItem>
                                {muscleGroups.map((group) => (
                                    <SelectItem key={group.id} value={group.id.toString()}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button variant="outline" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Results */}
                <Card>
                    {exercises.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-muted p-3 mb-4">
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            {hasActiveFilters ? (
                                <>
                                    <p className="text-lg font-medium mb-2">No exercises found</p>
                                    <p className="text-muted-foreground mb-4">
                                        Try adjusting your search or filters
                                    </p>
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear filters
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-medium mb-2">No exercises yet</p>
                                    <p className="text-muted-foreground mb-4">
                                        Create your first exercise to get started
                                    </p>
                                    <Link href="/exercises/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Your First Exercise
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <SortButton field="name">Exercise Name</SortButton>
                                        </TableHead>
                                        <TableHead>
                                            <SortButton field="primary_muscle_group">Primary Muscle</SortButton>
                                        </TableHead>
                                        <TableHead>Secondary Muscles</TableHead>
                                        <TableHead>
                                            <SortButton field="equipment">Equipment</SortButton>
                                        </TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exercises.data.map((exercise) => (
                                        <TableRow key={exercise.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <Link 
                                                    href={`/exercises/${exercise.id}`}
                                                    className="hover:underline"
                                                >
                                                    {exercise.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {exercise.primary_muscle_group.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {exercise.muscle_groups
                                                        ?.filter(mg => mg.pivot.involvement === 'secondary')
                                                        .map((mg) => (
                                                            <Badge key={mg.id} variant="outline" className="text-xs">
                                                                {mg.name}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {exercise.equipment?.name || (
                                                    <span className="text-muted-foreground">Bodyweight</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={exercise.is_compound ? "default" : "secondary"}>
                                                    {exercise.is_compound ? 'Compound' : 'Isolation'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/exercises/${exercise.id}`}>
                                                                View details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/exercises/${exercise.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(exercise.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {exercises.meta.last_page > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {exercises.meta.from}-{exercises.meta.to} of {exercises.meta.total} exercises
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {exercises.links.map((link: any, index: number) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
