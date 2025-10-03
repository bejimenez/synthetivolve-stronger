import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    DndContext, 
    DragEndEvent, 
    DragOverlay, 
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Settings, ArrowLeft } from 'lucide-react';
import { TrainingDayColumn } from '@/components/mesocycle/training-day-column';
import { AddExerciseDialog } from '@/components/mesocycle/add-exercise-dialog';
import { MesocycleShowPageProps, PlannedExercise, TrainingDay } from '@/types/mesocycle';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesocycle Planner',
        href: '/mesocycles',
    },
];

export default function Show({
    mesocycle,
    exercises,
    muscle_groups,
    intensity_types,
    technique_types
}: MesocycleShowPageProps) {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [activeExercise, setActiveExercise] = useState<PlannedExercise | null>(null);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [selectedTrainingDay, setSelectedTrainingDay] = useState<TrainingDay | null>(null);

    const currentWeek = mesocycle.weeks?.[selectedWeek];
    const trainingDays = currentWeek?.training_days || [];

    // Need to group training days by day_number to be able to accommodate 2-a-day sessions
    const groupedDays = trainingDays.reduce((acc, day) => {
        if (!acc[day.day_number]) {
            acc[day.day_number] = [];
        }
        acc[day.day_number].push(day);
        return acc;
    }, {} as Record<number, TrainingDay[]>);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const exercise = trainingDays
            .flatMap(day => day.planned_exercises || [])
            .find(ex => ex.id === active.id);

        if (exercise) {
            setActiveExercise(exercise);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveExercise(null);

        if (!over || active.id === over.id) return;

        const sourceExercise = trainingDays
            .flatMap(day => day.planned_exercises || [])
            .find(ex => ex.id === active.id);

        if (!sourceExercise) return;

        // Determine if moving within the same day or to a different day
        const targetDayId = typeof over.id === 'string' && over.id.startsWith('day-')
            ? parseInt(over.id.split('-')[1])
            : trainingDays
                .flatMap(day => day.planned_exercises || [])
                .find(ex => ex.id === over.id)?.training_day_id;

        if (!targetDayId) return;

        const allExercises = trainingDays.flatMap(day =>
            (day.planned_exercises || []).map(ex => ({
                ...ex,
                training_day_id: day.id
            }))
        );

        const sourceIndex = allExercises.findIndex(ex => ex.id === active.id);
        const targetIndex = typeof over.id === 'number'
            ? allExercises.findIndex(ex => ex.id === over.id)
            : allExercises.filter(ex => ex.training_day_id === targetDayId).length;

        const reordered = arrayMove(allExercises, sourceIndex, targetIndex);

        // if moving to different day
        if (targetDayId != sourceExercise.training_day_id) {
            const movedExercise = reordered[targetIndex];
            movedExercise.training_day_id = targetDayId;
        }

        const exercisesByDay = reordered.reduce((acc, ex) => {
            if (!acc[ex.training_day_id]) {
                acc[ex.training_day_id] = [];
            }
            acc[ex.training_day_id].push(ex);
            return acc;
        }, {} as Record<number, typeof reordered>);

        const updatedExercises = Object.values(exercisesByDay)
            .flat()
            .map((ex, idx, arr) => {
                const dayExercises = arr.filter(e => e.training_day_id === ex.training_day_id);
                const dayIndex = dayExercises.findIndex(e => e.id === ex.id);
                return {
                    id: ex.id,
                    training_day_id: ex.training_day_id,
                    order_index: dayIndex
                };
            });

        router.post(
            `/mesocycles/${mesocycle.id}/reorder-exercises`,
            { exercises: updatedExercises },
            { preserveScroll: true }
        );
    };

    const handleAddExercise = (trainingDay: TrainingDay) => {
        setSelectedTrainingDay(trainingDay);
        setShowAddExercise(true);
    };

    const handleAddSecondSession = (trainingDay: TrainingDay) => {
        router.post(
            `/mesocycles/${mesocycle.id}/training-days/${trainingDay.id}/second-session`,
            {},
            { preserveScroll: true }
        );
    };

    const handleRemoveSecondSession = (trainingDay: TrainingDay) => {
        if (confirm('Remove this second session? All exercises will be deleted.')) {
            router.delete(
                `/mesocycles/${mesocycle.id}/training-days/${trainingDay.id}/second-session`,
                { preserveScroll: true }
            );
        }
    };

    const handleRemoveExercise = (exerciseId: number) => {
        if (confirm('Remove this exercise from the plan?')) {
            router.delete(
                `/mesocycles/${mesocycle.id}/planned-exercises/${exerciseId}`,
                { preserveScroll: true }
            );
        }
    };

    const handleUpdateDayName = (trainingDayId: number, name: string) => {
        router.patch(
            `/mesocycles/${mesocycle.id}/training-days/${trainingDayId}`,
            { name },
            { preserveScroll: true }
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${mesocycle.name} - Mesocycle Planner`} />
            
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-sidebar-border bg-sidebar px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold truncate">{mesocycle.name}</h1>
                            {mesocycle.description && (
                                <p className="text-sm text-muted-foreground mt-1 truncate">
                                    {mesocycle.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/mesocycles">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Save and Return
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Week selector */}
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto">
                        {mesocycle.weeks?.map((week, index) => (
                            <Button
                                key={week.id}
                                variant={selectedWeek === index ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedWeek(index)}
                                className="shrink-0"
                            >
                                Week {week.week_number}
                                {week.week_type !== 'normal' && (
                                    <span className="ml-1 text-xs">({week.week_type})</span>
                                )}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Training days columns */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-4 p-6 min-w-max">
                            {Object.entries(groupedDays).map(([dayNumber, days]) => (
                                <div key={dayNumber} className="flex flex-col gap-4">
                                    {days.map((day) => (
                                        <TrainingDayColumn
                                            key={day.id}
                                            trainingDay={day}
                                            onAddExercise={() => handleAddExercise(day)}
                                            onAddSecondSession={() => handleAddSecondSession(days[0])}
                                            onRemoveSecondSession={() => handleRemoveSecondSession(day)}
                                            onRemoveExercise={handleRemoveExercise}
                                            onUpdateName={handleUpdateDayName}
                                            hasSecondSession={days.length > 1}
                                            isSecondSession={day.is_second_session}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <DragOverlay>
                        {activeExercise && activeExercise.exercise && (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                <div className="font-medium text-sm">
                                    {activeExercise.exercise.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {activeExercise.sets} × {activeExercise.rep_range}
                                </div>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Add Exercise Dialog */}
            {selectedTrainingDay && (
                <AddExerciseDialog
                    open={showAddExercise}
                    onOpenChange={setShowAddExercise}
                    trainingDay={selectedTrainingDay}
                    mesocycleId={mesocycle.id}
                    exercises={exercises}
                    intensityTypes={intensity_types}
                    techniqueTypes={technique_types}
                />
            )}
        </AppLayout>
    );
}
