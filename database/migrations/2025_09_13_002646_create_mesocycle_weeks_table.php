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
        Schema::create('mesocycle_weeks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mesocycle_id')->constrained()->cascadeOnDelete();
            $table->integer('week_number');
            $table->enum('week_type', ['normal', 'deload', 'testing'])->default('normal');
            $table->decimal('intensity_modifier', 3, 2)->default(1.00);
            $table->decimal('volume_modifier', 3, 2)->default(1.00);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['mesocycle_id', 'week_number']);
            $table->index('week_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mesocycle_weeks');
    }
};
