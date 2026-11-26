<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsArticle extends Model
{
    use HasTranslations;

    protected $fillable = [
        'news_category_id',
        'slug',
        'title',
        'excerpt',
        'body',
        'cover_image_path',
        'cover_image_alt',
        'featured',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }
}
