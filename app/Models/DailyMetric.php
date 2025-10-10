<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'metric_type',
        'value',
        'unit',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'value' => 'decimal:2',
    ];

    /**
     * Get the user that owns the metric.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include metrics of a given type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('metric_type', $type);
    }

    /**
     * Scope a query to only include metrics for a given date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Get the most recent metric for a user and type.
     */
    public static function getLatest(int $userId, string $type): ?self
    {
        return static::where('user_id', $userId)
            ->where('metric_type', $type)
            ->latest('date')
            ->first();
    }

    /**
     * Calculate 7-day rolling average for a metric type.
     */
    public static function getSevenDayAverage(int $userId, string $type, $endDate = null): array
    {
        $endDate = $endDate ?? now();
        $startDate = now()->subDays(6);

        $metrics = static::where('user_id', $userId)
            ->where('metric_type', $type)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->get();

        if ($metrics->isEmpty()) {
            return [];
        }

        // Calculate rolling average for each date
        $result = [];
        foreach ($metrics as $index => $metric) {
            // Get all values up to this point (max 7 days)
            $window = $metrics->slice(max(0, $index - 6), min($index + 1, 7));
            $average = $window->avg('value');
            
            $result[] = [
                'date' => $metric->date->format('Y-m-d'),
                'value' => round($metric->value, 2),
                'rolling_avg' => round($average, 2),
            ];
        }

        return $result;
    }
}
