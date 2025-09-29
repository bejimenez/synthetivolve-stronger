<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ExerciseController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Exercise::with(['primaryMuscleGroup', 'equipment', 'muscleGroups'])
            ->where('user_id', Auth::id());

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'ILIKE', "%{$searchTerm}%")
                  ->orWhereHas('primaryMuscleGroup', function ($mg) use ($searchTerm) {
                      $mg->where('name', 'ILIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('equipment', function ($eq) use ($searchTerm) {
                      $eq->where('name', 'ILIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('muscleGroups', function ($mg) use ($searchTerm) {
                      $mg->where('name', 'ILIKE', "%{$searchTerm}%");
                  });
            });
        }

        // Filter by muscle group
        if ($request->filled('muscle_group') && $request->muscle_group !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('primary_muscle_group_id', $request->muscle_group)
                  ->orWhereHas('muscleGroups', function ($mg) use ($request) {
                      $mg->where('muscle_group_id', $request->muscle_group);
                  });
            });
        }

        // Filter by equipment
        if ($request->filled('equipment')) {
            if ($request->equipment === 'bodyweight') {
                $query->whereNull('equipment_id');
            } else {
                $query->where('equipment_id', $request->equipment);
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');

        switch ($sortField) {
            case 'name':
                $query->orderBy('name', $sortDirection);
                break;
            case 'primary_muscle_group':
                $query->join('muscle_groups', 'exercises.primary_muscle_group_id', '=', 'muscle_groups.id')
                      ->orderBy('muscle_groups.name', $sortDirection)
                      ->select('exercises.*');
                break;
            case 'equipment':
                $query->leftJoin('equipment', 'exercises.equipment_id', '=', 'equipment.id')
                      ->orderBy('equipment.name', $sortDirection)
                      ->select('exercises.*');
                break;
            case 'created_at':
                $query->orderBy('created_at', $sortDirection);
                break;
            default:
                $query->orderBy('name', 'asc');
        }

        // Add secondary sort by name for consistency
        if ($sortField !== 'name') {
            $query->orderBy('exercises.name', 'asc');
        }

        $exercises = $query->paginate(15)
            ->withQueryString(); // Preserve query parameters in pagination links

        return Inertia::render('exercises/index', [
            'exercises' => ExerciseResource::collection($exercises),
            'muscleGroups' => MuscleGroup::orderBy('display_order')->get(['id', 'name']),
            'equipment' => Equipment::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $request->search,
                'muscle_group' => $request->muscle_group,
                'equipment' => $request->equipment,
                'sort' => $sortField,
                'direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('exercises/exercise-form', [
            'muscleGroups' => MuscleGroup::orderBy('display_order')->get(['id', 'name']),
            'equipment' => Equipment::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'primary_muscle_group_id' => 'required|exists:muscle_groups,id',
            'equipment_id' => 'nullable|exists:equipment,id',
            'is_compound' => 'boolean',
            'notes' => 'nullable|string|max:1000',
            'secondary_muscle_groups' => 'nullable|array',
            'secondary_muscle_groups.*' => 'exists:muscle_groups,id',
        ]);

        $exercise = Exercise::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'primary_muscle_group_id' => $validated['primary_muscle_group_id'],
            'equipment_id' => $validated['equipment_id'],
            'is_compound' => $validated['is_compound'] ?? false,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Attach secondary muscle groups if provided
        if (!empty($validated['secondary_muscle_groups'])) {
            $syncData = [];
            foreach ($validated['secondary_muscle_groups'] as $muscleGroupId) {
                $syncData[$muscleGroupId] = ['involvement' => 'secondary'];
            }
            $exercise->muscleGroups()->sync($syncData);
        }

        return redirect()->route('exercises.index')
            ->with('success', 'Exercise created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Exercise $exercise)
    {
        $this->authorize('view', $exercise);

        $exercise->load(['primaryMuscleGroup', 'equipment', 'muscleGroups', 'stats' => function ($query) {
            $query->where('user_id', Auth::id());
        }]);

        return Inertia::render('exercises/show', [
            'exercise' => new ExerciseResource($exercise),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exercise $exercise)
    {
        $this->authorize('update', $exercise);

        return Inertia::render('exercises/edit', [
            'exercise' => new ExerciseResource($exercise->load(['primaryMuscleGroup', 'equipment', 'muscleGroups'])),
            'muscleGroups' => MuscleGroup::orderBy('display_order')->get(['id', 'name']),
            'equipment' => Equipment::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exercise $exercise)
    {
        $this->authorize('update', $exercise);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'primary_muscle_group_id' => 'required|exists:muscle_groups,id',
            'equipment_id' => 'nullable|exists:equipment,id',
            'is_compound' => 'boolean',
            'notes' => 'nullable|string|max:1000',
            'secondary_muscle_groups' => 'nullable|array',
            'secondary_muscle_groups.*' => 'exists:muscle_groups,id',
        ]);

        $exercise->update([
            'name' => $validated['name'],
            'primary_muscle_group_id' => $validated['primary_muscle_group_id'],
            'equipment_id' => $validated['equipment_id'],
            'is_compound' => $validated['is_compound'] ?? false,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update secondary muscle groups
        if (isset($validated['secondary_muscle_groups'])) {
            $syncData = [];
            foreach ($validated['secondary_muscle_groups'] as $muscleGroupId) {
                $syncData[$muscleGroupId] = ['involvement' => 'secondary'];
            }
            $exercise->muscleGroups()->sync($syncData);
        } else {
            $exercise->muscleGroups()->detach();
        }

        return redirect()->route('exercises.index')
            ->with('success', 'Exercise updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exercise $exercise)
    {
        $this->authorize('delete', $exercise);

        $exercise->delete();

        return redirect()->route('exercises.index')
            ->with('success', 'Exercise deleted successfully!');
    }
}