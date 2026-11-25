<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category');
            $table->text('summary');
            $table->longText('description')->nullable();
            $table->string('image')->nullable();
            $table->string('image_alt')->nullable();
            $table->json('scope')->nullable();
            $table->json('benefits')->nullable();
            $table->longText('delivery_approach')->nullable();
            $table->json('related_projects')->nullable();
            $table->json('faqs')->nullable();
            $table->string('status')->default('draft')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
