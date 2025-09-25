import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exercises',
        href: '/exercises',
    },
    {
        title: 'Create Exercise',
        href: '/exercises/create',
    },
];

interface MuscleGroup {
    id: number;
    name: string;
}

interface Equipment {
    id: number;
    name: string;
}

interface Props {
    muscleGroups: MuscleGroup[];
    equipment: Equipment[];
}

export default function ExerciseForm({ muscleGroups, equipment }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        primary_muscle_group_id: '',
        equipment_id: '',
        is_compound: false,
        notes: '',
        secondary_muscle_groups: [] as string[],
    });

    const [selectedSecondaryMuscles, setSelectedSecondaryMuscles] = useState<MuscleGroup[]>([]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/exercises');
    };

    const handleSecondaryMuscleSelect = (muscleGroupId: string) => {
        if (muscleGroupId && !data.secondary_muscle_groups.includes(muscleGroupId)) {
            const muscle = muscleGroups.find(m => m.id.toString() === muscleGroupId);
            if (muscle) {
                setData('secondary_muscle_groups', [...data.secondary_muscle_groups, muscleGroupId]);
                setSelectedSecondaryMuscles([...selectedSecondaryMuscles, muscle]);
            }
        }
    };

    const removeSecondaryMuscle = (muscleGroupId: string) => {
        setData('secondary_muscle_groups', data.secondary_muscle_groups.filter(id => id !== muscleGroupId));
        setSelectedSecondaryMuscles(selectedSecondaryMuscles.filter(m => m.id.toString() !== muscleGroupId));
    };

    // Filter out already selected muscle groups from the dropdown
    const availableSecondaryMuscles = muscleGroups.filter(
        muscle => 
            muscle.id.toString() !== data.primary_muscle_group_id && 
            !data.secondary_muscle_groups.includes(muscle.id.toString())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Exercise" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Create a New Exercise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                            {/* Exercise Name */}
                            <div className='grid gap-2'>
                                <Label htmlFor='name'>Exercise Name</Label>
                                <Input
                                    id='name'
                                    name='name'
                                    type='text'
                                    placeholder='e.g., Bench Press'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoFocus
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Primary Muscle Group */}
                            <div className='grid gap-2'>
                                <Label htmlFor='primary_muscle_group'>Primary Muscle Group</Label>
                                <Select
                                    value={data.primary_muscle_group_id}
                                    onValueChange={(value) => setData('primary_muscle_group_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select primary muscle group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {muscleGroups.map((muscle) => (
                                            <SelectItem key={muscle.id} value={muscle.id.toString()}>
                                                {muscle.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.primary_muscle_group_id && (
                                    <p className="text-sm text-destructive">{errors.primary_muscle_group_id}</p>
                                )}
                            </div>

                            {/* Secondary Muscle Groups */}
                            <div className='grid gap-2'>
                                <Label htmlFor='secondary_muscle_groups'>Secondary Muscle Groups (Optional)</Label>
                                <Select
                                    value=""
                                    onValueChange={handleSecondaryMuscleSelect}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add secondary muscle groups" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSecondaryMuscles.map((muscle) => (
                                            <SelectItem key={muscle.id} value={muscle.id.toString()}>
                                                {muscle.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                {selectedSecondaryMuscles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedSecondaryMuscles.map((muscle) => (
                                            <Badge key={muscle.id} variant="secondary" className="gap-1">
                                                {muscle.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSecondaryMuscle(muscle.id.toString())}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Equipment */}
                            <div className='grid gap-2'>
                                <Label htmlFor='equipment'>Equipment</Label>
                                <Select
                                    value={data.equipment_id}
                                    onValueChange={(value) => setData('equipment_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select equipment (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equipment.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.equipment_id && (
                                    <p className="text-sm text-destructive">{errors.equipment_id}</p>
                                )}
                            </div>

                            {/* Movement Type */}
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    id='is_compound'
                                    checked={data.is_compound}
                                    onCheckedChange={(checked) => setData('is_compound', checked as boolean)}
                                />
                                <Label htmlFor='is_compound' className='cursor-pointer'>
                                    Compound Movement
                                </Label>
                            </div>

                            {/* Notes */}
                            <div className='grid gap-2'>
                                <Label htmlFor='notes'>Notes (Optional)</Label>
                                <Textarea
                                    id='notes'
                                    name='notes'
                                    placeholder='e.g., Focus on controlled eccentric, pause at bottom'
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-destructive">{errors.notes}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className='flex gap-4'>
                                <Button type='submit' disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Exercise'}
                                </Button>
                                <Link href='/exercises'>
                                    <Button type='button' variant='outline'>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}