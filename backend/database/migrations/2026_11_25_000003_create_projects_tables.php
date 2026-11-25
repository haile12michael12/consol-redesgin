<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('summary', 2000);
            $table->longText('overview');
            $table->string('client')->nullable();
            $table->boolean('client_approved')->default(false);
            $table->string('location')->nullable();
            $table->boolean('location_approved')->default(false);
            $table->string('duration')->nullable();
            $table->unsignedSmallInteger('year')->nullable()->index();
            $table->json('scope')->nullable();
            $table->json('services')->nullable();
            $table->json('outcomes')->nullable();
            $table->string('status')->default('draft')->index();
            $table->boolean('featured')->default(false)->index();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 1000)->nullable();
            $table->timestamps();
        });

        Schema::create('project_category_project', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['project_id', 'project_category_id']);
        });

        Schema::create('project_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('alt')->nullable();
            $table->boolean('is_cover')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_images');
        Schema::dropIfExists('project_category_project');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('project_categories');
    }
};
