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
        Schema::create('workouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('training_day_id')->nullable()->constrained();
            $table->enum('type', ['planned', 'freestyle']);
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('session_rpe', 3, 1)->nullable();
            $table->enum('mood', ['terrible', 'bad', 'neutral', 'good', 'excellent'])->nullable();
            $table->timestamps();

            $table->index(['user_id', 'started_at']);
            $table->index('training_day_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workouts');
    }
};
