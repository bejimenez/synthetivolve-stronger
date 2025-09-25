<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IntensityType extends Model
{
    use HasFactory;

    protected $fillable = [
            'name',
            'slug',
        ];

    public function plannedExercises(): HasMany
    {
        return $this->hasMany(PlannedExercise::class);
    }
}
