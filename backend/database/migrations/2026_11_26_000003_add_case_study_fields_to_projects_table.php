<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('project_type', 100)->nullable()->index();
            $table->date('project_date')->nullable();
            $table->text('context')->nullable();
            $table->json('objectives')->nullable();
            $table->longText('challenge')->nullable();
            $table->longText('approach')->nullable();
            $table->json('milestones')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['project_type']);
            $table->dropColumn([
                'project_type',
                'project_date',
                'context',
                'objectives',
                'challenge',
                'approach',
                'milestones',
            ]);
        });
    }
};
