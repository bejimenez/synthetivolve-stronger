<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('performed_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained();
            $table->foreignId('planned_exercise_id')->nullable()->constrained();
            $table->integer('set_number');
            $table->integer('reps');
            $table->decimal('weight', 6, 1);
            $table->string('weight_unit', 3)->default('lbs');
            $table->integer('rpe')->nullable();
            $table->integer('rir')->nullable();
            $table->foreignId('set_type_id')->nullable()->constrained();
            $table->text('notes')->nullable();
            $table->uuid('superset_group_id')->nullable();
            $table->integer('rest_taken_seconds')->nullable();
            $table->boolean('is_warmup')->default(false);
            $table->boolean('is_failure')->default(false);
            $table->timestamps();

            $table->index(['workout_id', 'exercise_id']);
            $table->index('planned_exercise_id');
            $table->index('superset_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performed_sets');
    }
};
