import { Button } from '@/components/ui/button';
import { PlannedExercise } from '@/types/mesocycle';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlannedExerciseCardProps {
    plannedExercise: PlannedExercise;
    onRemove: () => void;
}

export function PlannedExerciseCard({ plannedExercise, onRemove }: PlannedExerciseCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: plannedExercise.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const exercise = plannedExercise.exercise;

    if (!exercise) return null;

    // Determine muscle group color based on primary muscle group
    const getMuscleGroupColor = () => {
        const primaryMuscle = exercise.primary_muscle_group?.name.toLowerCase();
        
        if (primaryMuscle?.includes('chest')) return 'bg-pink-500/10 border-pink-500/20';
        if (primaryMuscle?.includes('back')) return 'bg-blue-500/10 border-blue-500/20';
        if (primaryMuscle?.includes('shoulder')) return 'bg-purple-500/10 border-purple-500/20';
        if (primaryMuscle?.includes('tricep')) return 'bg-pink-400/10 border-pink-400/20';
        if (primaryMuscle?.includes('bicep')) return 'bg-blue-400/10 border-blue-400/20';
        if (primaryMuscle?.includes('quad')) return 'bg-green-500/10 border-green-500/20';
        if (primaryMuscle?.includes('hamstring')) return 'bg-yellow-500/10 border-yellow-500/20';
        if (primaryMuscle?.includes('glute')) return 'bg-orange-500/10 border-orange-500/20';
        if (primaryMuscle?.includes('calv')) return 'bg-teal-500/10 border-teal-500/20';
        if (primaryMuscle?.includes('ab') || primaryMuscle?.includes('core')) return 'bg-red-500/10 border-red-500/20';
        
        return 'bg-neutral-500/10 border-neutral-500/20';
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative rounded-lg border p-3 transition-all hover:shadow-md',
                getMuscleGroupColor(),
                isDragging && 'opacity-50 shadow-lg'
            )}
        >
            <div className="flex items-start gap-2">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>

                {/* Exercise info */}
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                        {exercise.name}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">
                            {plannedExercise.sets} × {plannedExercise.rep_range}
                        </span>
                        
                        {plannedExercise.formatted_intensity && (
                            <>
                                <span>•</span>
                                <span>{plannedExercise.formatted_intensity}</span>
                            </>
                        )}
                        
                        {plannedExercise.technique_type && (
                            <>
                                <span>•</span>
                                <span className="truncate">{plannedExercise.technique_type.name}</span>
                            </>
                        )}
                    </div>

                    {plannedExercise.notes && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                            {plannedExercise.notes}
                        </div>
                    )}

                    {exercise.primary_muscle_group && (
                        <div className="text-xs text-muted-foreground mt-1">
                            {exercise.primary_muscle_group.name}
                        </div>
                    )}
                </div>

                {/* Delete button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onRemove}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}
