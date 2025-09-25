import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
}

interface Props {
    exercises: {
        data: Exercise[];
        links: any;
        meta: any;
    };
}

export default function Index({ exercises }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this exercise?')) {
            router.delete(`/exercises/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exercise Database" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Exercises</h2>
                    <Link href="/exercises/create">
                        <Button>Add New Exercise</Button>
                    </Link>
                </div>
                
                {exercises.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground mb-4">No exercises yet. Create your first exercise!</p>
                        <Link href="/exercises/create">
                            <Button>Create Exercise</Button>
                        </Link>
                    </div>
                ) : (
                    <div className='overflow-hidden border rounded-lg'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-muted/50'>
                                    <th className="p-4 text-left font-medium">#</th>
                                    <th className="p-4 text-left font-medium">Name</th>
                                    <th className="p-4 text-left font-medium">Primary Muscle</th>
                                    <th className="p-4 text-left font-medium">Equipment</th>
                                    <th className="p-4 text-left font-medium">Type</th>
                                    <th className="p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.data.map((exercise, index) => (
                                    <tr key={exercise.id} className="border-t hover:bg-muted/30 transition-colors">
                                        <td className='p-4 text-sm'>{index + 1}</td>
                                        <td className='p-4 font-medium'>{exercise.name}</td>
                                        <td className='p-4'>
                                            <Badge variant="outline">
                                                {exercise.primary_muscle_group.name}
                                            </Badge>
                                        </td>
                                        <td className='p-4'>
                                            {exercise.equipment ? exercise.equipment.name : 'None'}
                                        </td>
                                        <td className='p-4'>
                                            <Badge variant={exercise.is_compound ? "default" : "secondary"}>
                                                {exercise.is_compound ? 'Compound' : 'Isolation'}
                                            </Badge>
                                        </td>
                                        <td className='p-4'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/exercises/${exercise.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(exercise.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}