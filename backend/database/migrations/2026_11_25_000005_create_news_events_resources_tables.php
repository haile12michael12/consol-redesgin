<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt', 2000);
            $table->longText('body');
            $table->string('cover_image_path')->nullable();
            $table->string('cover_image_alt')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->string('status')->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 1000)->nullable();
            $table->timestamps();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('summary', 2000);
            $table->longText('body')->nullable();
            $table->timestamp('starts_at')->index();
            $table->timestamp('ends_at')->nullable();
            $table->string('venue');
            $table->string('registration_url', 2048)->nullable();
            $table->string('cover_image_path')->nullable();
            $table->string('cover_image_alt')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 1000)->nullable();
            $table->timestamps();
        });

        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('description', 2000);
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type', 127);
            $table->unsignedBigInteger('file_size');
            $table->boolean('approved_for_publication')->default(false);
            $table->string('status')->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 1000)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
        Schema::dropIfExists('events');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('news_categories');
    }
};
