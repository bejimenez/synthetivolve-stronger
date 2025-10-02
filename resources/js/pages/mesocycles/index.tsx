import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Mesocycle } from '@/types/mesocycle';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Dumbbell, TrendingUp } from 'lucide-react';
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
                            <Link key={mesocycle.id} href={`/mesocycles/${mesocycle.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    {mesocycle.name}
                                                </CardTitle>
                                                {mesocycle.description && (
                                                    <CardDescription className="mt-1">
                                                        {mesocycle.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                                                    mesocycle.status
                                                )}`}
                                            >
                                                {mesocycle.status}
                                            </span>
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
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
