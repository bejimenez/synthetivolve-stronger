<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MuscleGroup;

class MuscleGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $muscleGroups = [
                ['name' => 'Chest', 'slug' => 'chest', 'category' => 'upper', 'display_order' => 1],
                ['name' => 'Back', 'slug' => 'back', 'category' => 'upper', 'display_order' => 2],
                ['name' => 'Shoulders', 'slug' => 'shoulders', 'category' => 'upper', 'display_order' => 3],
                ['name' => 'Biceps', 'slug' => 'biceps', 'category' => 'upper', 'display_order' => 4],
                ['name' => 'Triceps', 'slug' => 'triceps', 'category' => 'upper', 'display_order' => 5],
                ['name' => 'Forearms', 'slug' => 'forearms', 'category' => 'upper', 'display_order' => 6],
                ['name' => 'Lower Back', 'slug' => 'lower-back', 'category' => 'core', 'display_order' => 7],
                ['name' => 'Abs', 'slug' => 'abs', 'category' => 'core', 'display_order' => 8],
                ['name' => 'Obliques', 'slug' => 'obliques', 'category' => 'core', 'display_order' => 9],
                ['name' => 'Quads', 'slug' => 'quads', 'category' => 'lower', 'display_order' => 10],
                ['name' => 'Hamstrings', 'slug' => 'hamstrings', 'category' => 'lower', 'display_order' => 11],
                ['name' => 'Glutes', 'slug' => 'glutes', 'category' => 'lower', 'display_order' => 12],
                ['name' => 'Calves', 'slug' => 'calves', 'category' => 'lower', 'display_order' => 13],
                ['name' => 'Adductors', 'slug' => 'adductors', 'category' => 'lower', 'display_order' => 14],
                ['name' => 'Abductors', 'slug' => 'abductors', 'category' => 'lower', 'display_order' => 15],
            ];

        foreach ($muscleGroups as $group) {
            MuscleGroup::create($group);
        }
    }
}
