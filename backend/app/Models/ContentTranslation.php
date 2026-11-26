<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ContentTranslation extends Model
{
    protected $fillable = [
        'locale',
        'fields',
        'published_fields',
        'status',
        'submitted_by',
        'submitted_at',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'fields' => 'array',
            'published_fields' => 'array',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function translatable(): MorphTo
    {
        return $this->morphTo();
    }
}
