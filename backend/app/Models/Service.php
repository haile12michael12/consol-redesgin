<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\HasTranslations;

class Service extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'slug',
        'title',
        'category',
        'summary',
        'description',
        'image',
        'image_alt',
        'scope',
        'benefits',
        'delivery_approach',
        'related_projects',
        'faqs',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'scope' => 'array',
            'benefits' => 'array',
            'related_projects' => 'array',
            'faqs' => 'array',
            'sort_order' => 'integer',
        ];
    }
}
