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
        Schema::create('planned_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_day_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->integer('order_index')->default();
            $table->integer('sets');
            $table->string('rep_range');
            $table->foreignId('intensity_type_id')->nullable()->constrained();
            $table->decimal('intensity_value', 4, 1)->nullable();
            $table->foreignId('technique_type_id')->nullable()->constrained();
            $table->integer('rest_seconds')->nullable();
            $table->text('notes')->nullable();
            $table->uuid('superset_group_id')->nullable();
            $table->timestamps();

            $table->index(['training_day_id', 'order_index']);
            $table->index('exercise_id');
            $table->index('superset_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planned_exercises');
    }
};
