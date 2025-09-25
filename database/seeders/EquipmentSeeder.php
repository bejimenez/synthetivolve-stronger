<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment = [
                ['name' => 'Barbell', 'slug' => 'barbell'],
                ['name' => 'Dumbbell', 'slug' => 'dumbbell'],
                ['name' => 'Cable', 'slug' => 'cable'],
                ['name' => 'Machine', 'slug' => 'machine'],
                ['name' => 'Smith Machine', 'slug' => 'smith-machine'],
                ['name' => 'Kettlebell', 'slug' => 'kettlebell'],
                ['name' => 'Bodyweight', 'slug' => 'bodyweight'],
                ['name' => 'Resistance Band', 'slug' => 'resistance-band'],
                ['name' => 'EZ Bar', 'slug' => 'ez-bar'],
                ['name' => 'Safety Squat Bar', 'slug' => 'safety-squat-bar'],
                ['name' => 'Trap Bar', 'slug' => 'trap-bar'],
                ['name' => 'Pull-up Bar', 'slug' => 'pull-up-bar'],
                ['name' => 'Dip Station', 'slug' => 'dip-station'],
                ['name' => 'TRX', 'slug' => 'trx'],
                ['name' => 'Medicine Ball', 'slug' => 'medicine-ball'],
                ['name' => 'Landmine', 'slug' => 'landmine'],
                ['name' => 'None', 'slug' => 'none'],
            ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }
    }
}
