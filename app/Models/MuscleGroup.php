<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MuscleGroup extends Model
{
    use HasFactory;

    protected $fillable = [
            'name',
            'slug',
            'category',
            'display_order',
        ];

    public function exercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'exercise_muscle_groups')
            ->withPivot('involvement')
            ->withTimestamps();
    }

    public function primaryExercises(): HasMany
    {
        return $this->hasMany(Exercise::class, 'primary_muscle_group_id');
    }

    public function trainingDays(): BelongsToMany
    {
        return $this->belongsToMany(TrainingDay::class, 'training_day_muscle_groups')
            ->withPivot('order_index')
            ->withTimestamps();
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
