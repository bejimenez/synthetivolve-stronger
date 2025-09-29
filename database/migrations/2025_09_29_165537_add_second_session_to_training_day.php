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
        Schema::table('training_days', function (Blueprint $table) {
            $table->boolean('is_second_session')->default(false)->after('order_index');
            $table->foreignId('parent_training_day_id')->nullable()->constrained('training_days')->nullOnDelete()->after('is_second_session');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_days', function (Blueprint $table) {
            $table->dropForeign(['parent_training_day_id']);
            $table->dropColumn(['is_second_session', 'parent_training_day_id']);
        });
    }
};
