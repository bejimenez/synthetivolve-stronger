<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\IntensityType;
use App\Models\Mesocycle;
use App\Models\MesocycleWeek;
use App\Models\MuscleGroup;
use App\Models\PlannedExercise;
use App\Models\TechniqueType;
use App\Models\TrainingDay;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\MesocycleResource;

class MesocycleController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mesocycles = Mesocycle::with(['weeks'])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();
        
        return Inertia::render('mesocycles/index', [
                'mesocycles' => MesocycleResource::collection($mesocycles),
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('mesocycles/create', [
        'muscle_groups' => MuscleGroup::orderBy('display_order')->get(['id', 'name', 'slug']),
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'start_date' => 'required|date',
                'duration_weeks' => 'required|integer|min:1|max:52',
                'training_days_per_week' => 'required|integer|min:1|max:7',
                'status' => 'sometimes|in:draft,active',
            ]);

        $mesocycle = Mesocycle::create([
                'user_id' => Auth::id(),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'start_date' => $validated['start_date'],
                'duration_weeks' => $validated['duration_weeks'],
                'training_days_per_week' => $validated['training_days_per_week'],
                'status' => $validated['status'] ?? 'draft',
                'settings' => [],
            ]);

        for ($weekNum = 1; $weekNum <= $validated['duration_weeks']; $weekNum++) {
            $week = MesocycleWeek::create([
                    'mesocycle_id' => $mesocycle->id,
                    'week_number' => $weekNum,
                    'week_type' => 'normal',
                ]);

            for ($dayNum = 1; $dayNum <= $validated['training_days_per_week']; $dayNum++) {
                TrainingDay::create([
                        'mesocycle_week_id' => $week->id,
                        'day_number' => $dayNum,
                        'name' => "Day {$dayNum}",
                        'order_index' => $dayNum - 1,
                    ]);
            }
        }

        return redirect()->route('mesocycles.show', $mesocycle)
            ->with('success', 'Mesocycle created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Mesocycle $mesocycle)
    {
        $this->authorize('view', $mesocycle);

        $mesocycle->load([
                'weeks.trainingDays' => function ($query) {
                    $query->with([
                            'plannedExercises.exercise.primaryMuscleGroup',
                            'plannedExercises.exercise.muscleGroups',
                            'plannedExercises.intensityType',
                            'plannedExercises.techniqueType',
                            'muscleGroups',
                        ])->orderBy('order_index');
                }
            ]);

        $exercises = Exercise::with(['primaryMuscleGroup', 'muscleGroups'])
            ->where('user_id', Auth::id())
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('mesocycles/show', [
                'mesocycle' => new MesocycleResource($mesocycle),
                'exercises' => $exercises,
                'muscle_groups' => MuscleGroup::orderBy('display_order')->get(['id', 'name', 'slug']),
                'intensity_types' => IntensityType::all(['id', 'name', 'slug']),
                'technique_types' => TechniqueType::all(['id', 'name', 'slug', 'description']),
            ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mesocycle $mesocycle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mesocycle $mesocycle)
    {
        $this->authorize('update', $mesocycle);

        $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string|max:1000',
                'status' => 'sometimes|in:draft,active,completed,archived',
            ]);

        $mesocycle->update($validated);

        return back()->with('success', 'Mesocycle updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mesocycle $mesocycle)
    {
        $this->authorize('delete', $mesocycle);

        $mesocycle->delete();

        return redirect()->route('mesocycles.index')
            ->with('success', 'Mesocycle deleted successfully!');
    }

    public function updateTrainingDay(Request $request, Mesocycle $mesocycle, TrainingDay $trainingDay)
    {
        $this->authorize('update', $mesocycle);

        $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'notes' => 'nullable|string|max:1000',
                'day_of_week' => 'nullable|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            ]);

        $trainingDay->update($validated);

        return back();
    }

    public function addSecondSession(Request $request, Mesocycle $mesocycle, TrainingDay $trainingDay)
    {
        $this->authorize('update', $mesocycle);

        if ($trainingDay->secondSession) {
            return back()->withErrors(['error' => 'Second session already exists for this day.']);
        }

        $secondSession = TrainingDay::create([
                'mesocycle_week_id' => $trainingDay->mesocycle_week_id,
                'day_number' => $trainingDay->day_number,
                'name' => "{$trainingDay->name} - PM",
                'order_index' => $trainingDay->order_index + 0.5,
                'is_second_session' => true,
                'parent_training_day_id' => $trainingDay->id,
            ]);

        if (strpos($trainingDay->name, ' - ') === false) {
            $trainingDay->update(['name' => "{$trainingDay->name} - AM"]);
        }

        return back()->with('success', 'Second session added successfully!');
    }

    public function removeSecondSession(Mesocycle $mesocycle, TrainingDay $trainingDay)
    {
        $this->authorize('update', $mesocycle);

        if (!$trainingDay->is_second_session) {
            return back()->withErrors(['error' => 'This is not a second session.']);
        }

        $parent = $trainingDay->parentTrainingDay;
        $trainingDay->delete();

        if ($parent && strpos($parent->name, ' - AM') != false) {
            $parent->update(['name' => str_replace(' - AM', '', $parent->name
            )]);
        }

        return back()->with('success', 'Second session removed successfully!');
    }

    public function addExercise(Request $request, Mesocycle $mesocycle, TrainingDay $trainingDay)
    {
        $this->authorize('update', $mesocycle);

        $validated = $request->validate([
                'exercise_id' => 'required|exists:exercises,id',
                'sets' => 'required|integer|min:1|max:20',
                'rep_range' => 'required|string|max:50',
                'intensity_type_id' => 'nullable|exists:intensity_types_id',
                'intensity_value' => 'nullable|numeric|min:0',
                'technique_type_id' => 'nullable|exists:technique_types_id',
                'notes' => 'nullable|string|max:500',
            ]);

        $maxOrder = $trainingDay->plannedExercises()->max('order_index') ?? -1;

        $plannedExercise = PlannedExercise::create([
                'training_day_id' => $trainingDay->id,
                'exercise_id' => $validated['exercise_id'],
                'order_index' => $maxOrder + 1,
                'sets' => $validated['sets'],
                'rep_range' => $validated['rep_range'],
                'intensity_type_id' => $validated['intensity_type_id'] ?? null,
                'intensity_value' => $validated['intensity_value'] ?? null,
                'technique_type_id' => $validated['technique_type_id'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

        return back()->with('success', 'Exercise added successfully!');
    }

    public function updateExercise(Request $request, Mesocycle $mesocycle, PlannedExercise $plannedExercise)
    {
        $this->authorize('update', $mesocycle);

        $validated = $request->validate([
                'sets' => 'sometimes|integer|min:1|max:20',
                'rep_range' => 'sometimes|string|max:50',
                'intensity_type_id' => 'nullable|exists:intensity_types,id',
                'intensity_value' => 'nullable|numeric|min:0',
                'technique_type_id' => 'nullable|exists:technique_types,id',
                'notes' => 'nullable|string|max:500',
            ]);

        $plannedExercise->update($validated);

        return back();
    }

    public function removeExercise(Mesocycle $mesocycle, PlannedExercise $plannedExercise)
    {
        $this->authorize('update', $mesocycle);

        $trainingDayId = $plannedExercise->training_day_id;
        $removedIndex = $plannedExercise->order_index;

        $plannedExercise->delete();

        PlannedExercise::where('training_day_id', $trainingDayId)
            ->where('order_index', '>', $removedIndex)
            ->decrement('order_index');

        return back();
    }

    public function reorderExercises(Request $request, Mesocycle $mesocycle)
    {
        $this->authorize('update', $mesocycle);

        $validated = $request->validate([
                'exercises' => 'required|array',
                'exercises.*.id' => 'required|exists:planned_exercises,id',
                'exercises.*.training_day_id' => 'required|exists:training_days,id',
                'exercises.*.order_index' => 'required|integer|min:0',
            ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['exercises'] as $exerciseData) {
                PlannedExercise::where('id', $exerciseData['id'])
                    ->update([
                            'training_day_id' => $exerciseData['training_day_id'],
                            'order_index' => $exerciseData['order_index'],
                        ]);
            }
        });

        return back();
    }

    public function duplicateWeek(Request $request, Mesocycle $mesocycle, MesocycleWeek $sourceWeek)
    {
        $this->authorize('update', $mesocycle);

        $validated = $request->validate([
                'target_week_number' => 'required|integer|min:1',
            ]);

        $targetWeek = $mesocycle->weeks()
            ->where('week_number', $validated['target_week_number'])
            ->firstOrFail();

        DB::transaction(function () use ($sourceWeek, $targetWeek) {
            $sourceWeek->load('trainingDays.plannedExercises');

            foreach ($sourceWeek->trainingDays as $sourceDay) {
                $targetDay = $targetWeek->trainingDays()
                    ->where('day_number', $sourceDay->day_number)
                    ->where('is_second_session', $sourceDay->is_second_session)
                    ->first();

                if ($targetDay) {
                    $targetDay->plannedExercises()->delete();

                    foreach ($sourceDay->plannedExercises as $sourceExercise) {
                        PlannedExercise::create([
                                'training_day_id' => $targetDay->id,
                                'exercise_id' => $sourceExercise->exercise_id,
                                'order_index' => $sourceExercise->order_index,
                                'sets' => $sourceExercise->sets,
                                'rep_range' => $sourceExercise->rep_range,
                                'intensity_type_id' => $sourceExercise->intensity_type_id,
                                'intensity_value' => $sourceExercise->intensity_value,
                                'technique_type_id' => $sourceExercise->technique_type_id,
                                'notes' => $sourceExercise->notes,
                                'superset_group_id' => $sourceExercise->superset_group_id
                            ]);
                    }
                    $targetDay->update([
                            'name' => $sourceDay->name,
                            'notes' => $sourceDay->notes,
                        ]);
                }
            }
        });

        return back()->with('success', 'Week programming duplicated successfully!');
    }
    
}
