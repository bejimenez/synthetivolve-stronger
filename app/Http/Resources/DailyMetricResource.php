<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyMetricResource extends JsonResource
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
            'date' => $this->date->format('Y-m-d'),
            'metric_type' => $this->metric_type,
            'value' => (float) $this->value,
            'unit' => $this->unit,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
