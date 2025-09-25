<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlannedExercise extends Model
{
    use HasFactory;

    protected $fillable = [
            'training_day_id',
            'exercise_id',
            'order_index',
            'sets',
            'rep_range',
            'intensity_type_id',
            'intensity_value',
            'technique_type_id',
            'rest_seconds',
            'notes',
            'superset_group_id',
        ];

    protected $casts = [
            'intensity_value' => 'decimal:1',
        ];

    public function trainingDay(): BelongsTo
    {
        return $this->belongsTo(TrainingDay::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function intensityType(): BelongsTo
    {
        return $this->belongsTo(IntensityType::class);
    }

    public function techniqueType(): BelongsTo
    {
        return $this->belongsTo(TechniqueType::class);
    }

    public function performedSets(): HasMany
    {
        return $this->hasMany(PerformedSet::class);
    }

    public function scopeInSupersetGroup($query, $groupId)
    {
        return $query->where('superset_group_id', $groupId);
    }

    public function getFormattedIntensityAttribute()
    {
        if (!$this->intensity_type_id || !$this->intensity_value) {
            return null;
        }

        $type = $this->intensityType->slug;
        $value = $this->intensity_value;

        return match($type) {
            'rpe' => "RPE {$value}",
            'percentage_1rm' => "{$value}% 1RM",
            'rir' => "{$value} RIR",
            default => null,
        };
    }
}
