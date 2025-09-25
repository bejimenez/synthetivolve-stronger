<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MesocycleWeek extends Model
{
    use HasFactory;

    protected $fillable = [
            'mesocycle_id',
            'week_number',
            'week_type',
            'intensity_modifier',
            'volume_modifier',
            'notes',
        ];

    protected $casts = [
            'intensity_modifier' => 'decimal:2',
            'volume_modifier' => 'decimal:2',
        ];

    public function mesocycle(): BelongsTo
    {
        return $this->belongsTo(Mesocycle::class);
    }

    public function trainingDays(): HasMany
    {
        return $this->hasMany(TrainingDay::class)->orderBy('order_index');
    }

    public function plannedExercises()
    {
        return $this->hasManyThrough(PlannedExercise::class, TrainingDay::class);
    }

    public function scopeNormalWeeks($query)
    {
        return $query->where('week_type', 'normal');
    }

    public function scopeDeloadWeeks($query)
    {
        return $query->where('week_type', 'deload');
    }
}
