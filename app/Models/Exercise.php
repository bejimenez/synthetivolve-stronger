<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
            'user_id',
            'name',
            'primary_muscle_group_id',
            'equipment_id',
            'notes',
            'is_compound',
            'is_active',
        ];

    protected $casts = [
            'is_compound' => 'boolean',
            'is_active' => 'boolean',
        ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function primaryMuscleGroup(): BelongsTo
    {
        return $this->belongsTo(MuscleGroup::class, 'primary_muscle_group_id');
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function muscleGroups(): BelongsToMany
    {
        return $this->belongsToMany(MuscleGroup::class, 'exercise_muscle_groups')
            ->withPivot('involvement')
            ->withTimestamps();
    }

    public function secondaryMuscleGroups(): BelongsToMany
    {
        return $this->muscleGroups()->wherePivot('involvement', 'secondary');
    }

    public function plannedExercises(): HasMany
    {
        return $this->hasMany(PlannedExercise::class);
    }

    public function performedSets(): HasMany
    {
        return $this->hasMany(PerformedSet::class);
    }

    public function stats(): HasOne
    {
        return $this->hasOne(ExerciseStat::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
