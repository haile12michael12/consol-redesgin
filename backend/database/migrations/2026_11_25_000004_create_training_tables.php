<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('description', 1000)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('position')->nullable();
            $table->longText('biography')->nullable();
            $table->longText('professional_background')->nullable();
            $table->json('expertise')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_category_id')->constrained()->restrictOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('summary', 2000);
            $table->longText('description');
            $table->string('image_path')->nullable();
            $table->string('image_alt')->nullable();
            $table->json('learning_objectives')->nullable();
            $table->json('curriculum')->nullable();
            $table->string('duration')->nullable();
            $table->string('delivery_method')->nullable();
            $table->json('requirements')->nullable();
            $table->json('faqs')->nullable();
            $table->string('credential_name')->nullable();
            $table->string('credential_issuer')->nullable();
            $table->boolean('credential_verified')->default(false);
            $table->boolean('certificate_supported')->default(false);
            $table->boolean('registration_enabled')->default(false)->index();
            $table->boolean('featured')->default(false)->index();
            $table->string('status')->default('draft')->index();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 1000)->nullable();
            $table->timestamps();
        });

        Schema::create('course_instructor', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('instructor_id')->constrained()->cascadeOnDelete();
            $table->primary(['course_id', 'instructor_id']);
        });

        Schema::create('course_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->dateTime('registration_opens_at')->nullable();
            $table->dateTime('registration_closes_at')->nullable();
            $table->string('delivery_method')->nullable();
            $table->string('location')->nullable();
            $table->unsignedSmallInteger('max_participants')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamps();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference')->unique();
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->foreignId('course_schedule_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 40);
            $table->string('organization')->nullable();
            $table->string('preferred_schedule')->nullable();
            $table->text('additional_information')->nullable();
            $table->string('status')->default('pending')->index();
            $table->timestamp('consent_at');
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('status');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('recorded_at');
            $table->timestamps();
        });

        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->unique()->constrained()->restrictOnDelete();
            $table->string('verification_code', 40)->unique();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('issued_at');
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('course_schedules');
        Schema::dropIfExists('course_instructor');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('instructors');
        Schema::dropIfExists('course_categories');
    }
};
