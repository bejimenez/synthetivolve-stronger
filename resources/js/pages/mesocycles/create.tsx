import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MuscleGroup } from '@/types/mesocycle';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesocycle Planner',
        href: '/mesocycles',
    },
    {
        title: 'Create',
        href: '/mesocycles/create',
    },
];

interface MesocycleCreateProps {
    muscle_groups: MuscleGroup[];
}

export default function Create({ muscle_groups }: MesocycleCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        start_date: '',
        duration_weeks: '4',
        training_days_per_week: '4',
        status: 'draft',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mesocycles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Mesocycle" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-2xl mx-auto w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Mesocycle</CardTitle>
                            <CardDescription>
                                Set up the basic structure of your training cycle
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Mesocycle Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Spring 2025 Hypertrophy Block"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your training goals and focus for this cycle..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>

                                {/* Start Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-destructive">{errors.start_date}</p>
                                    )}
                                </div>

                                {/* Duration and Days per Week */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration_weeks">Duration (weeks) *</Label>
                                        <Select
                                            value={data.duration_weeks}
                                            onValueChange={(value) => setData('duration_weeks', value)}
                                        >
                                            <SelectTrigger id="duration_weeks">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[2, 3, 4, 5, 6, 8, 10, 12, 16].map((weeks) => (
                                                    <SelectItem key={weeks} value={weeks.toString()}>
                                                        {weeks} weeks
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.duration_weeks && (
                                            <p className="text-sm text-destructive">
                                                {errors.duration_weeks}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="training_days_per_week">
                                            Training Days/Week *
                                        </Label>
                                        <Select
                                            value={data.training_days_per_week}
                                            onValueChange={(value) =>
                                                setData('training_days_per_week', value)
                                            }
                                        >
                                            <SelectTrigger id="training_days_per_week">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[2, 3, 4, 5, 6, 7].map((days) => (
                                                    <SelectItem key={days} value={days.toString()}>
                                                        {days} days
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.training_days_per_week && (
                                            <p className="text-sm text-destructive">
                                                {errors.training_days_per_week}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Set to "Draft" to plan without activating, or "Active" to start training immediately
                                    </p>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit('/mesocycles')}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        {processing ? 'Creating...' : 'Create Mesocycle'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-4 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">What happens next?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>
                                After creating your mesocycle, you'll be taken to the planner where you can:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Customize training day names (defaults to "Day 1", "Day 2", etc.)</li>
                                <li>Add exercises with drag-and-drop reordering</li>
                                <li>Split days into morning and evening sessions (2-a-day)</li>
                                <li>Set rep ranges, RPE, and technique types</li>
                                <li>Copy programming between weeks</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
