<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['uploaded_by', 'original_name', 'path', 'mime_type', 'file_size', 'alt', 'collection'])]
class Media extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['file_size' => 'integer'];
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
