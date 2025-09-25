<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SetType;

class SetTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $setTypes = [
            ['name' => 'Straight Set', 'slug' => 'straight', 'abbreviation' => 'STR', 'description' => 'Standard working set'],
            ['name' => 'Drop Set', 'slug' => 'drop', 'abbreviation' => 'DROP', 'description' => 'Reduce weight and continue for more reps'],
            ['name' => 'AMRAP', 'slug' => 'amrap', 'abbreviation' => 'AMRAP', 'description' => 'As many reps as possible'],
            ['name' => 'Myo-Rep', 'slug' => 'myo_rep', 'abbreviation' => 'MYO', 'description' => 'Activation set followed by mini-sets'],
            ['name' => 'Myo-Rep Match', 'slug' => 'myo_match', 'abbreviation' => 'MATCH', 'description' => 'Match the reps of the myo-rep activation set'],
            ['name' => 'Superset', 'slug' => 'superset', 'abbreviation' => 'SS', 'description' => 'Two exercises performed back-to-back'],
            ['name' => 'Giant Set', 'slug' => 'giant', 'abbreviation' => 'GS', 'description' => 'Three or more exercises performed back-to-back'],
            ['name' => 'Cluster Set', 'slug' => 'cluster', 'abbreviation' => 'CLUS', 'description' => 'Rest-pause between mini-sets'],
            ['name' => 'Rest-Pause', 'slug' => 'rest_pause', 'abbreviation' => 'RP', 'description' => 'Brief rest then continue'],
            ['name' => 'Negative', 'slug' => 'negative', 'abbreviation' => 'NEG', 'description' => 'Eccentric-only repetitions'],
            ['name' => 'Forced Reps', 'slug' => 'forced', 'abbreviation' => 'FORCE', 'description' => 'Assisted repetitions after failure'],
            ['name' => 'Lengthened Partial', 'slug' => 'lengthened_partial', 'abbreviation' => 'PART', 'description' => 'Partial range of motion done in the stretched/bottom position only'],
            ['name' => 'Pause Rep', 'slug' => 'pause', 'abbreviation' => 'PAUSE', 'description' => 'Pause at specific point in movement'],
            ];

        foreach ($setTypes as $type) {
            SetType::create($type);
        }
    }
}
