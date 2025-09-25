<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExerciseStat extends Model
{
    use HasFactory;

    protected $fillable = [
            'exercise_id',
            'user_id',
            'times_performed',
            'max_weight',
            'max_reps_at_max_weight',
            'max_volume',
            'estimated_1rm',
            'last_performed_date',
            'pr_date',
        ];

    protected $casts = [
            'max_weight' => 'decimal:2',
            'max_volume' => 'decimal:2',
            'estimated_1rm' => 'decimal:2',
            'last_performed_date' => 'date',
            'pr_date' => 'date',
        ];

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function updateFromPerformedSet(PerformedSet $set)
    {
        $this->times_performed++;
        $this->last_performed_date = now();

        if ($set->weight > $this->max_weight) {
            $this->max_weight = $set->weight;
            $this->max_reps_at_max_weight = $set->reps;
            $this->pr_date = now();
        }

        $estimated1RM = $set->estimated_1rm;
        if ($estimated1RM && $estimated1RM > $this->estimated_1rm) {
            $this->estimated1RM = $estimated1RM;
        }

        $this->save();
    }

    public function calculateSessionVolume($workoutId)
    {
        return PerformedSet::where('workout_id', $workoutId)
            ->where('exercise_id', $this->exercise_id)
            ->where('is_warmup', false)
            ->sum(\DB::raw('weight * reps'));
    }
}
