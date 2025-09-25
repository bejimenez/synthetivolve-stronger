<?php

namespace Database\Seeders;

use App\Models\TechniqueType;
use Illuminate\Database\Seeder;

class TechniqueTypeSeeder extends Seeder
{
    public function run(): void
    {
        $techniques = [
            ['name' => 'Straight Sets', 'slug' => 'straight_sets', 'description' => 'Traditional sets with rest between'],
            ['name' => 'Supersets', 'slug' => 'supersets', 'description' => 'Two exercises performed back-to-back'],
            ['name' => 'Giant Sets', 'slug' => 'giant_sets', 'description' => 'Three or more exercises back-to-back'],
            ['name' => 'Drop Sets', 'slug' => 'drop_sets', 'description' => 'Reduce weight and continue'],
            ['name' => 'Myo-Reps', 'slug' => 'myo_reps', 'description' => 'Activation set followed by mini-sets'],
            ['name' => 'Cluster Sets', 'slug' => 'cluster_sets', 'description' => 'Rest-pause between mini-sets'],
            ['name' => 'AMRAP', 'slug' => 'amrap', 'description' => 'As many reps as possible'],
            ['name' => 'EMOM', 'slug' => 'emom', 'description' => 'Every minute on the minute'],
        ];

        foreach ($techniques as $technique) {
            TechniqueType::create($technique);
        }
    }
}
