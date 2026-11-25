<?php

namespace App\Http\Requests;

use App\Models\ResourceDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResourceDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdministrator() ?? false;
    }

    public function rules(): array
    {
        $resource = $this->route('resource');
        $scheduled = $this->input('status') === 'scheduled';

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('resources', 'slug')->ignore($resource instanceof ResourceDocument ? $resource->id : null),
            ],
            'description' => ['required', 'string', 'max:2000'],
            'file' => [
                $resource instanceof ResourceDocument ? 'nullable' : 'required',
                'file',
                'mimes:pdf',
                'max:20480',
            ],
            'approved_for_publication' => ['required', 'boolean'],
            'status' => ['required', Rule::in(['draft', 'scheduled', 'published'])],
            'published_at' => [$scheduled ? 'required' : 'nullable', 'date', $scheduled ? 'after:now' : 'sometimes'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
