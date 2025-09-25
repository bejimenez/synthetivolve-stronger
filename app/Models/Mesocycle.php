<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Mesocycle extends Model
{
    use HasFactory;

    protected $fillable = [
            'user_id',
            'name',
            'description',
            'start_date',
            'duration_weeks',
            'training_days_per_week',
            'status',
            'settings',
        ];

    protected $casts = [
            'start_date' => 'date',
            'settings' => 'array',
        ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function weeks(): HasMany
    {
        return $this->hasMany(MesocycleWeek::class)->orderBy('week_number');
    }

    public function trainingDays(): HasManyThrough
    {
        return $this->hasManyThrough(Workout::class, TrainingDay::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function getEndDateAttribute()
    {
        return $this->start_date->addWeeks($this->duration_weeks);
    }

    public function getCurrentWeekAttribute()
    {
        $weeksElapsed = $this->start_date->diffInWeeks(now());
        return min($weeksElapsed + 1, $this->duration_weeks);
    }
}
