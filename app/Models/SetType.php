<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SetType extends Model
{
    use HasFactory;

    protected $fillable = [
            'name',
            'slug',
            'abbreviation',
            'description',
        ];

    public function performedSets(): HasMany
    {
        return $this->hasMany(PerformedSet::class);
    }

    public function scopeCommon($query)
    {
        return $query->whereIn('slug', ['straight', 'drop', 'amrap', 'myo_rep', 'myo_rep_match', 'superset', 'giant_set', 'cluster_set', 'rest_pause', 'negative', 'forced_reps', 'lengthened_partial', 'pause_rep']);
    }
}
