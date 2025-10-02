import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Exercise, IntensityType, TechniqueType, TrainingDay } from '@/types/mesocycle';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

interface AddExerciseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trainingDay: TrainingDay;
    mesocycleId: number;
    exercises: Exercise[];
    intensityTypes: IntensityType[];
    techniqueTypes: TechniqueType[];
}

export function AddExerciseDialog({
    open,
    onOpenChange,
    trainingDay,
    mesocycleId,
    exercises,
    intensityTypes,
    techniqueTypes,
}: AddExerciseDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [sets, setSets] = useState('3');
    const [repRange, setRepRange] = useState('8-12');
    const [intensityTypeId, setIntensityTypeId] = useState<string>('');
    const [intensityValue, setIntensityValue] = useState('');
    const [techniqueTypeId, setTechniqueTypeId] = useState<string>('');
    const [restSeconds, setRestSeconds] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ex.primary_muscle_group?.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedExerciseId) return;

        setProcessing(true);

        const data: any = {
            exercise_id: selectedExerciseId,
            sets: parseInt(sets),
            rep_range: repRange,
        };

        if (intensityTypeId) {
            data.intensity_type_id = parseInt(intensityTypeId);
            if (intensityValue) {
                data.intensity_value = parseFloat(intensityValue);
            }
        }

        if (techniqueTypeId) {
            data.technique_type_id = parseInt(techniqueTypeId);
        }

        if (restSeconds) {
            data.rest_seconds = parseInt(restSeconds);
        }

        if (notes) {
            data.notes = notes;
        }

        router.post(
            `/mesocycles/${mesocycleId}/training-days/${trainingDay.id}/exercises`,
            data,
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    resetForm();
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const resetForm = () => {
        setSearchTerm('');
        setSelectedExerciseId(null);
        setSets('3');
        setRepRange('8-12');
        setIntensityTypeId('');
        setIntensityValue('');
        setTechniqueTypeId('');
        setRestSeconds('');
        setNotes('');
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm();
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Exercise to {trainingDay.name}</DialogTitle>
                    <DialogDescription>
                        Select an exercise and configure the sets, reps, and intensity.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Exercise Search/Select */}
                        <div className="space-y-2">
                            <Label htmlFor="exercise-search">Exercise</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="exercise-search"
                                    placeholder="Search exercises..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Exercise list */}
                            <div className="max-h-48 overflow-y-auto border rounded-md">
                                {filteredExercises.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No exercises found
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {filteredExercises.map((exercise) => (
                                            <button
                                                key={exercise.id}
                                                type="button"
                                                onClick={() => setSelectedExerciseId(exercise.id)}
                                                className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${
                                                    selectedExerciseId === exercise.id
                                                        ? 'bg-accent'
                                                        : ''
                                                }`}
                                            >
                                                <div className="font-medium text-sm">
                                                    {exercise.name}
                                                </div>
                                                {exercise.primary_muscle_group && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {exercise.primary_muscle_group.name}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedExerciseId && (
                            <>
                                {/* Sets and Reps */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sets">Sets</Label>
                                        <Input
                                            id="sets"
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rep-range">Rep Range</Label>
                                        <Input
                                            id="rep-range"
                                            placeholder="e.g., 8-12"
                                            value={repRange}
                                            onChange={(e) => setRepRange(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Intensity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="intensity-type">Intensity Type</Label>
                                        <Select
                                            value={intensityTypeId}
                                            onValueChange={setIntensityTypeId}
                                        >
                                            <SelectTrigger id="intensity-type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Content">None</SelectItem>
                                                {intensityTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={type.id.toString()}
                                                    >
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {intensityTypeId && (
                                        <div className="space-y-2">
                                            <Label htmlFor="intensity-value">Value</Label>
                                            <Input
                                                id="intensity-value"
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                placeholder="e.g., 7.5"
                                                value={intensityValue}
                                                onChange={(e) => setIntensityValue(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Technique Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="technique-type">Technique Type</Label>
                                    <Select
                                        value={techniqueTypeId}
                                        onValueChange={setTechniqueTypeId}
                                    >
                                        <SelectTrigger id="technique-type">
                                            <SelectValue placeholder="Select technique" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Technique">Straight Sets</SelectItem>
                                            {techniqueTypes.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={type.id.toString()}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (optional)</Label>
                                    <Input
                                        id="notes"
                                        placeholder="Any special instructions..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!selectedExerciseId || processing}>
                            {processing ? 'Adding...' : 'Add Exercise'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
