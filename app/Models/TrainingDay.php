<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingDay extends Model
{
    use HasFactory;

    protected $fillable = [
            'mesocycle_week_id',
            'day_number',
            'name',
            'order_index',
            'notes',
        ];

    public function mesocycleWeek(): BelongsTo
    {
        return $this->belongsTo(MesocycleWeek::class);
    }

    public function muscleGroups(): BelongsToMany
    {
        return $this->belongsToMany(MuscleGroup::class, 'training_day_muscle_groups')
            ->withPivot('order_index')
            ->orderByPivot('order_index')
            ->withTimestamps();
    }

    public function plannedExercises(): HasMany
    {
        return $this->hasMany(PlannedExercise::class)->orderBy('order_index');
    }

    public function workouts(): HasMany
    {
        return $this->hasMany(Workout::class);
    }

    public function scopeForDay($query, $dayNumber)
    {
        return $query->where('day_number', $dayNumber);
    }

    public function getTotalSetsAttribute()
    {
        return $this->plannedExercises->sum('sets');
    }

    public function getVolumeByMuscleGroup()
    {
        return $this->plannedExercises()
            ->with('exercise.muscleGroups')
            ->get()
            ->flatMap(function ($plannedExercise) {
                return $plannedExercise->exercise->muscleGroups->map(function ($muscleGroup) use ($plannedExercise) {
                    $multiplier = $muscleGroup->pivot->involvement === 'primary' ? 1 : 0.5;
                    return [
                            'muscle_group_id' => $muscleGroup->id,
                            'sets' => $plannedExercise->sets * $multiplier,
                        ];
                });
            })
            ->groupBy('muscle_group_id')
            ->map->sum('sets');
    }
}
