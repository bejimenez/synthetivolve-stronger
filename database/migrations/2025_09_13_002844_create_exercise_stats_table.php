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
        Schema::create('exercise_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('times_performed')->default(0);
            $table->decimal('max_weight', 6, 2)->nullable();
            $table->integer('max_reps_at_max_weight')->nullable();
            $table->decimal('max_volume', 8, 2)->nullable();
            $table->decimal('estimated_1rm', 6, 2)->nullable();
            $table->date('last_performed_date')->nullable();
            $table->date('pr_date')->nullable();
            $table->timestamps();

            $table->unique(['exercise_id', 'user_id']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_stats');
    }
};
