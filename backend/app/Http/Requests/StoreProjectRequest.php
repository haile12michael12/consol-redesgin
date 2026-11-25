<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdministrator() ?? false;
    }

    public function rules(): array
    {
        $project = $this->route('project');
        $imageRule = Rule::exists('project_images', 'id');
        if ($project instanceof Project) {
            $imageRule->where(fn ($query) => $query->where('project_id', $project->id));
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug')->ignore($project?->id),
            ],
            'summary' => ['required', 'string', 'max:2000'],
            'overview' => ['required', 'string', 'max:20000'],
            'client' => ['nullable', 'string', 'max:255'],
            'client_approved' => ['nullable', 'boolean'],
            'location' => ['nullable', 'string', 'max:255'],
            'location_approved' => ['nullable', 'boolean'],
            'duration' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'categories' => ['required', 'array', 'min:1', 'max:10'],
            'categories.*' => ['required', 'integer', 'distinct', Rule::exists('project_categories', 'id')],
            'scope' => ['nullable', 'array', 'max:30'],
            'scope.*' => ['required', 'string', 'max:1500'],
            'services' => ['nullable', 'array', 'max:30'],
            'services.*' => ['required', 'string', 'max:255'],
            'outcomes' => ['nullable', 'array', 'max:30'],
            'outcomes.*' => ['required', 'string', 'max:1500'],
            'status' => ['required', Rule::in([
                ContentStatus::Draft->value,
                ContentStatus::Published->value,
            ])],
            'featured' => ['required', 'boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
            'images' => ['nullable', 'array', 'max:12'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
                'dimensions:max_width=6000,max_height=6000',
            ],
            'image_alts' => ['nullable', 'array', 'max:12'],
            'image_alts.*' => ['nullable', 'string', 'max:255'],
            'remove_image_ids' => ['nullable', 'array', 'max:12'],
            'remove_image_ids.*' => ['required', 'integer', 'distinct', $imageRule],
        ];
    }
}
