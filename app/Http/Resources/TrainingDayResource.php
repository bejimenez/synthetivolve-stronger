<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingDayResource extends JsonResource
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
            'mesocycle_week_id' => $this->mesocycle_week_id,
            'day_number' => $this->day_number,
            'name' => $this->name,
            'order_index' => $this->order_index,
            'notes' => $this->notes,
            'is_second_session' => (bool) $this->is_second_session,
            'parent_training_day_id' => $this->parent_training_day_id,
            
            // Relationships - only when loaded
            'planned_exercises' => PlannedExerciseResource::collection($this->whenLoaded('plannedExercises')),
            
            'muscle_groups' => $this->when(
                $this->relationLoaded('muscleGroups'),
                function () {
                    return $this->muscleGroups->map(function ($muscleGroup) {
                        return [
                            'id' => $muscleGroup->id,
                            'name' => $muscleGroup->name,
                            'slug' => $muscleGroup->slug,
                            'order_index' => $muscleGroup->pivot->order_index,
                        ];
                    });
                }
            ),
            
            // Computed attributes
            'total_sets' => $this->when(
                $this->relationLoaded('plannedExercises'),
                $this->total_sets
            ),
        ];
    }
}
