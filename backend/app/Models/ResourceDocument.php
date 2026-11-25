<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceDocument extends Model
{
    protected $table = 'resources';

    protected $fillable = [
        'slug',
        'title',
        'description',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'approved_for_publication',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'approved_for_publication' => 'boolean',
            'file_size' => 'integer',
            'published_at' => 'datetime',
        ];
    }
}
