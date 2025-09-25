<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
    	return [
    	        'id' => $this->id,
    	        'name' => $this->name,
    	        'primary_muscle_group' => [
    	            'id' => $this->primaryMuscleGroup->id,
    	            'name' => $this->primaryMuscleGroup->name,
    	        ],
    	        'equipment' => $this->equipment ? [
    	                'id' => $this->equipment->id,
    	                'name' => $this->equipment->name,
    	            ] : null,
    	        'secondary_muscle_groups' => $this->whenLoaded('muscleGroups', function () {
    	            return $this->muscleGroups->map(function ($muscleGroup) {
    	                return [
    	                        'id' => $muscleGroup->id,
    	                        'name' => $muscleGroup->name,
    	                        'involvement' => $muscleGroup->pivot->involvement,
    	                    ];
    	            });
    	        }),
    	        'is_compound' => $this->is_compound,
    	        'notes' => $this->notes,
    	        'created_at' => $this->created_at->format('Y-m-d'),
    	    ];
    }
}
