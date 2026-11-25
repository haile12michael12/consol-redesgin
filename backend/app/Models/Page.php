<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'slug', 'path', 'title', 'summary', 'content', 'sections', 'status',
    'published_at', 'seo_title', 'seo_description', 'updated_by',
])]
class Page extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'sections' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
