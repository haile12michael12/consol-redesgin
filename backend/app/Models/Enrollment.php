<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'course_id',
        'course_schedule_id',
        'full_name',
        'email',
        'phone',
        'organization',
        'preferred_schedule',
        'additional_information',
        'status',
        'consent_at',
    ];

    protected function casts(): array
    {
        return ['consent_at' => 'datetime'];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(CourseSchedule::class, 'course_schedule_id');
    }

    public function attendance(): HasOne
    {
        return $this->hasOne(Attendance::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }
}
