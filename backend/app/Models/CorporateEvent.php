<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorporateEvent extends Model
{
    protected $table = 'events';

    protected $fillable = [
        'slug',
        'title',
        'summary',
        'body',
        'starts_at',
        'ends_at',
        'venue',
        'registration_url',
        'cover_image_path',
        'cover_image_alt',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }
}
