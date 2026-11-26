<?php

namespace App\Http\Requests;

use App\Models\CorporateEvent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCorporateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccessAdmin() ?? false;
    }

    public function rules(): array
    {
        $event = $this->route('event');
        $scheduled = $this->input('status') === 'scheduled';

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('events', 'slug')->ignore($event instanceof CorporateEvent ? $event->id : null),
            ],
            'summary' => ['required', 'string', 'max:2000'],
            'body' => ['nullable', 'string', 'max:50000'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'venue' => ['required', 'string', 'max:255'],
            'registration_url' => ['nullable', 'url', 'max:2048'],
            'status' => ['required', Rule::in(['draft', 'scheduled', 'published'])],
            'published_at' => [$scheduled ? 'required' : 'nullable', 'date', $scheduled ? 'after:now' : 'sometimes'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
                'dimensions:max_width=6000,max_height=6000',
            ],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'remove_cover_image' => ['nullable', 'boolean'],
        ];
    }
}
