<?php

namespace App\Policies;

use App\Models\DailyMetric;
use App\Models\User;

class DailyMetricPolicy
{
    /**
     * Determine whether the user can update the metric.
     */
    public function update(User $user, DailyMetric $metric): bool
    {
        return $user->id === $metric->user_id;
    }

    /**
     * Determine whether the user can delete the metric.
     */
    public function delete(User $user, DailyMetric $metric): bool
    {
        return $user->id === $metric->user_id;
    }
}
