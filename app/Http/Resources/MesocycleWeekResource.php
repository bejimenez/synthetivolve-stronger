<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MesocycleWeekResource extends JsonResource
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
            'mesocycle_id' => $this->mesocycle_id,
            'week_number' => $this->week_number,
            'week_type' => $this->week_type,
            'intensity_modifier' => (float) $this->intensity_modifier,
            'volume_modifier' => (float) $this->volume_modifier,
            'notes' => $this->notes,
            
            // Relationships - only when loaded
            'training_days' => TrainingDayResource::collection($this->whenLoaded('trainingDays')),
        ];
    }
}
