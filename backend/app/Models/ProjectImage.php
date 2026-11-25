<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'path',
        'alt',
        'is_cover',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_cover' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
