<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'position',
        'biography',
        'professional_background',
        'expertise',
        'status',
    ];

    protected function casts(): array
    {
        return ['expertise' => 'array'];
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class);
    }
}
