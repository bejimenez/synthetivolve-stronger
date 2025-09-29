<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'notes' => $this->notes,
            'is_compound' => $this->is_compound,
            'is_active' => $this->is_active,
            'primary_muscle_group' => [
                'id' => $this->primaryMuscleGroup->id,
                'name' => $this->primaryMuscleGroup->name,
            ],
            'equipment' => $this->equipment ? [
                'id' => $this->equipment->id,
                'name' => $this->equipment->name,
            ] : null,
            'muscle_groups' => $this->muscleGroups->map(function ($muscleGroup) {
                return [
                    'id' => $muscleGroup->id,
                    'name' => $muscleGroup->name,
                    'pivot' => [
                        'involvement' => $muscleGroup->pivot->involvement,
                    ],
                ];
            }),
            'stats' => $this->whenLoaded('stats', function () {
                return $this->stats->first();
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}