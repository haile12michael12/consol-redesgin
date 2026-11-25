<?php

namespace App\Models;

use App\Enums\InquiryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'type',
    'name',
    'email',
    'phone',
    'organization',
    'subject',
    'service_of_interest',
    'project_description',
    'preferred_contact_method',
    'status',
    'assigned_to',
    'consent_at',
])]
class Inquiry extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => InquiryStatus::class,
            'consent_at' => 'datetime',
        ];
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(InquiryNote::class)->latest();
    }
}
