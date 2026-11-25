<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseCategory extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'name', 'description', 'sort_order'];

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
