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
        Schema::create('training_day_muscle_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_day_id')->constrained()->cascadeOnDelete();
            $table->foreignId('muscle_group_id')->constrained()->cascadeOnDelete();
            $table->integer('order_index')->default(0);
            $table->timestamps();

            $table->unique(['training_day_id', 'muscle_group_id']);
            $table->index('muscle_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_day_muscle_groups');
    }
};
