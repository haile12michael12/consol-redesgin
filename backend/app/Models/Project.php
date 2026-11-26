<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'slug',
        'title',
        'summary',
        'overview',
        'client',
        'client_approved',
        'location',
        'location_approved',
        'duration',
        'year',
        'scope',
        'services',
        'outcomes',
        'status',
        'featured',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'client_approved' => 'boolean',
            'location_approved' => 'boolean',
            'scope' => 'array',
            'services' => 'array',
            'outcomes' => 'array',
            'featured' => 'boolean',
            'year' => 'integer',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ProjectCategory::class, 'project_category_project')
            ->orderBy('sort_order')
            ->orderBy('name');
    }
}
