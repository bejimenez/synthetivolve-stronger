<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformedSet extends Model
{
    use HasFactory;

    protected $fillable = [
            'workout_id',
            'exercise_id',
            'planned_exercise_id',
            'set_number',
            'reps',
            'weight',
            'weight_unit',
            'rpe',
            'rir',
            'set_type_id',
            'notes',
            'superset_group_id',
            'rest_taken_seconds',
            'is_warmup',
            'is_failure',
        ];

    protected $casts = [
            'weight' => 'decimal:2',
            'rpe' => 'decimal:1',
            'is_warmup' => 'boolean',
            'is_failure' => 'boolean',
        ];

    public function workout(): BelongsTo
    {
        return $this->belongsTo(Workout::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function plannedExercise(): BelongsTo
    {
        return $this->belongsTo(PlannedExercise::class);
    }

    public function setType(): BelongsTo
    {
        return $this->belongsTo(SetType::class);
    }

    public function scopeWorkingSets($query)
    {
        return $query->where('is_warmup', false);
    }

    public function scopeForExercise($query, $exerciseId)
    {
        return $query->where('exercise_id', $exerciseId);
    }

    public function getVolumeAttribute()
    {
        return $this->weight * $this->reps;
    }

    public function getEstimated1RMAttribute()
    {
        if ($this->reps >= 1 && $this->reps <= 12) {
            return $this->weight / (1.0278 - 0.0278 * $this->reps);
        }
        return null;
    }

    public function getIntensityAttribute()
    {
        if ($this->rpe) {
            return "RPE {$this->rpe}";
        }
        if ($this->rir !== null) {
            return "{$this->rir} RIR";
        }
        return null;
    }
}
