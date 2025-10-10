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
        Schema::create('daily_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('metric_type', ['bodyweight', 'steps']);
            $table->decimal('value', 8, 2);
            $table->string('unit', 10)->default('lbs');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date', 'metric_type']);

            $table->index(['user_id', 'metric_type', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_metrics');
    }
};
