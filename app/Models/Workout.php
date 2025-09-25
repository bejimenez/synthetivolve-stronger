<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workout extends Model
{
    use HasFactory;

    protected $fillable = [
            'user_id',
            'training_day_id',
            'type',
            'started_at',
            'completed_at',
            'duration_seconds',
            'notes',
            'session_rpe',
            'mood',
        ];

    protected $casts = [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'session_rpe' => 'decimal:1',
        ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function trainingDay(): BelongsTo
    {
        return $this->belongsTo(TrainingDay::class);
    }

    public function performedSets(): HasMany
    {
        return $this->hasMany(PerformedSet::class);
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    public function scopeInProgress($query)
    {
        return $query->whereNull('completed_at');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopePlanned($query)
    {
        return $query->where('type', 'planned');
    }

    public function scopeFreestyle($query)
    {
        return $query->where('type', 'freestyle');
    }

    public function getIsCompletedAttribute()
    {
        return $this->completed_at !== null;
    }

    public function getTotalVolumeAttribute()
    {
        return $this->performedSets()
            ->where('is_warmup', false)
            ->sum(\DB::raw('weight * reps'));
    }

    public function getTotalSetsAttribute()
    {
        return $this->performedSets()
            ->where('is_warmup', false)
            ->count();
    }
}
