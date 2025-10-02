<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlannedExerciseResource extends JsonResource
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
            'training_day_id' => $this->training_day_id,
            'exercise_id' => $this->exercise_id,
            'order_index' => $this->order_index,
            'sets' => $this->sets,
            'rep_range' => $this->rep_range,
            'intensity_type_id' => $this->intensity_type_id,
            'intensity_value' => $this->intensity_value ? (float) $this->intensity_value : null,
            'technique_type_id' => $this->technique_type_id,
            'rest_seconds' => $this->rest_seconds,
            'notes' => $this->notes,
            'superset_group_id' => $this->superset_group_id,
            
            // Relationships - only when loaded
            'exercise' => new ExerciseResource($this->whenLoaded('exercise')),
            
            'intensity_type' => $this->when(
                $this->relationLoaded('intensityType') && $this->intensityType,
                function () {
                    return [
                        'id' => $this->intensityType->id,
                        'name' => $this->intensityType->name,
                        'slug' => $this->intensityType->slug,
                    ];
                }
            ),
            
            'technique_type' => $this->when(
                $this->relationLoaded('techniqueType') && $this->techniqueType,
                function () {
                    return [
                        'id' => $this->techniqueType->id,
                        'name' => $this->techniqueType->name,
                        'slug' => $this->techniqueType->slug,
                        'description' => $this->techniqueType->description,
                    ];
                }
            ),
            
            // Computed attributes
            'formatted_intensity' => $this->formatted_intensity,
        ];
    }
}
