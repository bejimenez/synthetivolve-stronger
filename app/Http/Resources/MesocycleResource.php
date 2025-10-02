<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MesocycleResource extends JsonResource
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
            'description' => $this->description,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'duration_weeks' => $this->duration_weeks,
            'training_days_per_week' => $this->training_days_per_week,
            'status' => $this->status,
            'settings' => $this->settings,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            
            // Conditional attributes
            'current_week' => $this->when(
                $this->status === 'active',
                $this->current_week
            ),
            
            // Relationships - only when loaded
            'weeks' => MesocycleWeekResource::collection($this->whenLoaded('weeks')),
        ];
    }
}
