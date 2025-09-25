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
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->foreignId('primary_muscle_group_id')->constrained('muscle_groups');
            $table->foreignId('equipment_id')->nullable()->constrained();
            $table->text('notes')->nullable();
            $table->boolean('is_compound')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'name']);
            $table->index('primary_muscle_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
