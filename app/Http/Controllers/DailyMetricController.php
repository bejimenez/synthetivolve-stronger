<?php

namespace App\Http\Controllers;

use App\Http\Resources\DailyMetricResource;
use App\Models\DailyMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DailyMetricController extends Controller
{
    /**
     * Store a newly created metric.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|before_or_equal:today',
            'metric_type' => ['required', Rule::in(['bodyweight', 'steps'])],
            'value' => 'required|numeric|min:0',
            'unit' => 'required|string|max:10',
            'notes' => 'nullable|string|max:500',
        ]);

        $metric = DailyMetric::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'metric_type' => $validated['metric_type'],
            ],
            [
                'value' => $validated['value'],
                'unit' => $validated['unit'],
                'notes' => $validated['notes'] ?? null,
            ]
        );

        return back()->with('success', 'Metric recorded successfully!');
    }

    /**
     * Update an existing metric.
     */
    public function update(Request $request, DailyMetric $metric)
    {
        $this->authorize('update', $metric);

        $validated = $request->validate([
            'value' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        $metric->update($validated);

        return back()->with('success', 'Metric updated successfully!');
    }

    /**
     * Remove a metric.
     */
    public function destroy(DailyMetric $metric)
    {
        $this->authorize('delete', $metric);

        $metric->delete();

        return back()->with('success', 'Metric deleted successfully!');
    }

    /**
     * Get metrics for dashboard.
     */
    public function dashboard()
    {
        $userId = Auth::id();

        // Get last 30 days of data for both metrics
        $bodyweightData = DailyMetric::getSevenDayAverage($userId, 'bodyweight');
        $stepsData = DailyMetric::getSevenDayAverage($userId, 'steps');

        // Get latest values
        $latestBodyweight = DailyMetric::getLatest($userId, 'bodyweight');
        $latestSteps = DailyMetric::getLatest($userId, 'steps');

        return response()->json([
            'bodyweight' => [
                'data' => $bodyweightData,
                'latest' => $latestBodyweight ? new DailyMetricResource($latestBodyweight) : null,
            ],
            'steps' => [
                'data' => $stepsData,
                'latest' => $latestSteps ? new DailyMetricResource($latestSteps) : null,
            ],
        ]);
    }
}
