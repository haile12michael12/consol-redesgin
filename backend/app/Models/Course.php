<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'course_category_id',
        'slug',
        'title',
        'summary',
        'description',
        'image_path',
        'image_alt',
        'learning_objectives',
        'curriculum',
        'duration',
        'delivery_method',
        'requirements',
        'faqs',
        'credential_name',
        'credential_issuer',
        'credential_verified',
        'certificate_supported',
        'registration_enabled',
        'featured',
        'status',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'learning_objectives' => 'array',
            'curriculum' => 'array',
            'requirements' => 'array',
            'faqs' => 'array',
            'credential_verified' => 'boolean',
            'certificate_supported' => 'boolean',
            'registration_enabled' => 'boolean',
            'featured' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'course_category_id');
    }

    public function instructors(): BelongsToMany
    {
        return $this->belongsToMany(Instructor::class)->orderBy('name');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(CourseSchedule::class)->orderBy('starts_at');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
