<?php

namespace App\Models\Concerns;

use App\Models\ContentTranslation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasTranslations
{
    public static function bootHasTranslations(): void
    {
        static::deleting(function (Model $model): void {
            $model->translations()->delete();
        });
    }

    public function translations(): MorphMany
    {
        return $this->morphMany(ContentTranslation::class, 'translatable');
    }

    public function translationFields(string $locale): array
    {
        if ($locale !== 'am') {
            return [];
        }

        $translation = $this->relationLoaded('translations')
            ? $this->translations->firstWhere('locale', $locale)
            : $this->translations()->where('locale', $locale)->first();

        return $translation?->published_fields ?? [];
    }

    public function localizedValue(string $attribute, string $locale): mixed
    {
        $fields = $this->translationFields($locale);
        $value = $fields[$attribute] ?? null;

        return $value !== null && $value !== '' && $value !== []
            ? $value
            : $this->getAttribute($attribute);
    }
}
