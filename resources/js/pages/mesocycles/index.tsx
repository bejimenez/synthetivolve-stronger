import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Mesocycle } from '@/types/mesocycle';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Dumbbell, TrendingUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesocycle Planner',
        href: '/mesocycles',
    },
];

interface MesocycleIndexProps {
    mesocycles: Mesocycle[];
}

export default function Index({ mesocycles }: MesocycleIndexProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'completed':
                return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'draft':
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'archived':
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const handleDelete = (e: React.MouseEvent, mesocycle: Mesocycle) => {
        e.preventDefault(); // Prevent navigation to mesocycle detail
        e.stopPropagation(); // Stop event bubbling
        
        if (confirm(`Are you sure you want to delete "${mesocycle.name}"? This action cannot be undone and will delete all associated weeks, days, and exercises.`)) {
            router.delete(`/mesocycles/${mesocycle.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mesocycle Planner" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mesocycle Planner</h1>
                        <p className="text-muted-foreground mt-1">
                            Plan your training cycles and track your progress
                        </p>
                    </div>
                    <Link href="/mesocycles/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Mesocycle
                        </Button>
                    </Link>
                </div>

                {/* Mesocycles list */}
                {mesocycles.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Dumbbell className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No mesocycles yet</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            Create your first mesocycle to start planning your training program.
                            Organize your workouts by weeks and days with drag-and-drop simplicity.
                        </p>
                        <Link href="/mesocycles/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Mesocycle
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mesocycles.map((mesocycle) => (
                            <Card key={mesocycle.id} className="hover:shadow-lg transition-shadow h-full group">
                                <Link href={`/mesocycles/${mesocycle.id}`} className="block">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg truncate">
                                                    {mesocycle.name}
                                                </CardTitle>
                                                {mesocycle.description && (
                                                    <CardDescription className="mt-1 line-clamp-2">
                                                        {mesocycle.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                                                        mesocycle.status
                                                    )}`}
                                                >
                                                    {mesocycle.status}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={(e) => handleDelete(e, mesocycle)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete mesocycle</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {format(new Date(mesocycle.start_date), 'MMM d, yyyy')} -{' '}
                                                {format(new Date(mesocycle.end_date), 'MMM d, yyyy')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {mesocycle.duration_weeks}
                                                </span>
                                                <span className="text-muted-foreground">weeks</span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {mesocycle.training_days_per_week}
                                                </span>
                                                <span className="text-muted-foreground">days/week</span>
                                            </div>
                                        </div>

                                        {mesocycle.status === 'active' && mesocycle.current_week && (
                                            <div className="pt-3 border-t">
                                                <div className="text-xs text-muted-foreground">
                                                    Currently on week
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {mesocycle.current_week} / {mesocycle.duration_weeks}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
