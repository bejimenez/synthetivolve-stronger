<?php

namespace Database\Seeders;

use App\Models\IntensityType;
use Illuminate\Database\Seeder;

class IntensityTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'RPE', 'slug' => 'rpe'],
            ['name' => '%1RM', 'slug' => 'percentage_1rm'],
            ['name' => 'RIR', 'slug' => 'rir'],
        ];

        foreach ($types as $type) {
            IntensityType::create($type);
        }
    }
}
