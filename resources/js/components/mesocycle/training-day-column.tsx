import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrainingDay } from '@/types/mesocycle';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PlannedExerciseCard } from './planned-exercise-card';

interface TrainingDayColumnProps {
    trainingDay: TrainingDay;
    onAddExercise: () => void;
    onAddSecondSession: () => void;
    onRemoveSecondSession: () => void;
    onRemoveExercise: (exerciseId: number) => void;
    onUpdateName: (trainingDayId: number, name: string) => void;
    hasSecondSession: boolean;
    isSecondSession: boolean;
}

export function TrainingDayColumn({
    trainingDay,
    onAddExercise,
    onAddSecondSession,
    onRemoveSecondSession,
    onRemoveExercise,
    onUpdateName,
    hasSecondSession,
    isSecondSession,
}: TrainingDayColumnProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState(trainingDay.name);

    const { setNodeRef } = useDroppable({
        id: `day-${trainingDay.id}`,
    });

    const plannedExercises = trainingDay.planned_exercises || [];
    const exerciseIds = plannedExercises.map(ex => ex.id);

    const handleNameBlur = () => {
        setIsEditingName(false);
        if (name !== trainingDay.name) {
            onUpdateName(trainingDay.id, name);
        }
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNameBlur();
        } else if (e.key === 'Escape') {
            setName(trainingDay.name);
            setIsEditingName(false);
        }
    };

    return (
        <Card className="w-80 flex flex-col bg-sidebar border-sidebar-border shrink-0">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    {isEditingName ? (
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleNameBlur}
                            onKeyDown={handleNameKeyDown}
                            className="h-8 text-sm font-semibold"
                            autoFocus
                        />
                    ) : (
                        <button
                            onClick={() => setIsEditingName(true)}
                            className="text-sm font-semibold hover:text-foreground/80 transition-colors text-left"
                        >
                            {trainingDay.name}
                        </button>
                    )}
                    
                    {isSecondSession && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={onRemoveSecondSession}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {trainingDay.muscle_groups && trainingDay.muscle_groups.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {trainingDay.muscle_groups.map((mg) => (
                            <span
                                key={mg.id}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                            >
                                {mg.name}
                            </span>
                        ))}
                    </div>
                )}

                {trainingDay.total_sets !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                        {trainingDay.total_sets} total sets
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex-1 space-y-2" ref={setNodeRef}>
                <SortableContext items={exerciseIds} strategy={verticalListSortingStrategy}>
                    {plannedExercises.map((exercise) => (
                        <PlannedExerciseCard
                            key={exercise.id}
                            plannedExercise={exercise}
                            onRemove={() => onRemoveExercise(exercise.id)}
                        />
                    ))}
                </SortableContext>

                {plannedExercises.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        No exercises yet
                    </div>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={onAddExercise}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                </Button>

                {!hasSecondSession && !isSecondSession && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={onAddSecondSession}
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Second Session
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
